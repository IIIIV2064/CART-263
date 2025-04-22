
"use strict";
//Variables & Objects//

let state = 'main'; //start on main green
let foont; //font used
let bgm; // the music

let volume,level; // var for sound level
let scale = 1; // var for zoom level

let earth, mapTexture; //obj related to earth

let explosions = []; //array of explosions

let exoSFX, exoVFX, explosionDetector; // obj related to explosions

let maxCasualty = 10_000_000;
let minCasualty = 100_000_000;
let totalCasualty = 0; // for display purpose
let explosionCount = 0; //for log purpose

const debounce = (fn, delay) => { //a debouncer / buffer to limit action per time, for bombs
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
};

//Setups//
function preload(){ //preload extenral assets such as images and musics
        foont = loadFont('assets/CASLON.ttf');
        mapTexture = loadImage('assets/EarthMap.png');
        bgm = loadSound('assets/28DaysLater.mp3');
}


function setup() { //setup the canvas and the js objects
        createCanvas(windowWidth, windowHeight,WEBGL);

        earth = new Globe(); //create things
        exoSFX = new SFX();
        exoVFX = new VFX();
        explosionDetector = new p5.Amplitude(); //create a detector of sound level
}

//State Manager//

function draw() {
      background(0) //set background color

       if( state === 'main' ){ 
          mainScreen();
       }else if ( state === 'earth' ){
          simScreen();
       }else if ( state === 'end' ){
          endScreen();
       };



      //console.log(explosionCount);
      console.log(volume);
      //console.log(exoVFX.size);
}
//States//

function mainScreen(){ //main screen
      push();
        textAlign(CENTER);
        fill(250);
        textSize(20);
        textFont(foont);
        text('click to see earth',0,0);
      pop();

};

function simScreen(){ //simulation screen


      earth.spin(); //execute spin function first
      earth.display(); //show globe and update motion

      audioTrigger(); //audio detector for auto bomb
      casualtyCheck(); //prorgess tracker

      textAlign(CENTER); // display casualty UO
      fill(250);
      textSize(20);
      textFont(foont);
      text('casualties: '+totalCasualty.toLocaleString(),400,200);

      for (let i = explosions.length - 1; i >= 0; i--) {
            let explosion = explosions[i];
                
            if (explosion.boom) {
                  explosion.bombAnimation();
                  explosion.bombVisual();
            } else {
                  explosions.splice(i, 1);
            }
      }

};

function endScreen(){ //end screen
      bgm.stop();

        textAlign(CENTER);
        fill(200);
        textFont(foont);
        textSize(20);
        text('now its gone',0,0);
};

//Mechanical Functions//

function bombDropping(){ //setting the explosion in motion 
      exoVFX.resetPosition();
      exoSFX.bombSound();
      explosions.push(exoVFX);

      exoVFX.boom=true;

      let bombCasualty = Math.floor(Math.random() * (maxCasualty - minCasualty + 1)) + minCasualty; //generate a random number of casualty per bomb
      totalCasualty += bombCasualty; //add said random number to the total
      explosionCount += 1; //add 1 bomb count for log purpose
};

const debouncedBombDropping = debounce(bombDropping, 200); //buffer explosions within a time period

function audioTrigger(){
      explosionDetector.setInput(bgm); // makes the earth 'vibrate'
      level = explosionDetector.getLevel();
      volume = map(level,0.001,0.2,1,10,true);

      if(volume >= 3.5){ //triggers random explosions when pass a certain treshhold
            bombDropping();
            earth.strokeColor.r = 250; // change earth color to red
            earth.strokeColor.b = 0;
      }else if(volume <=3.5){
            earth.strokeColor.r = 0;
            earth.strokeColor.b = 250;
      }

};

function casualtyCheck(){

      if(totalCasualty>= 8_000_000_000){ //detect when to end earth
            state = "end"; 
      }
};

function resetWorld(){ //reset when the simulation ends
      totalCasualty = 0;
      explosionCount = 0; 
      volume = 0;

      state ='main';
};

//User Inputs//

function mouseClicked(){ //what mouse lick does during each state

      if( state === 'main'){ //start game
          state = 'earth'
      }else if( state === 'earth'){
          if(bgm.isPlaying()){
            bgm.playMode('sustain');//keep music playing if already started 
          }else{
            bgm.play();
          };
          debouncedBombDropping();// drops bomb on click
      }else if( state === 'end'){
          resetWorld();
      }

};

function mousePressed(){ //drag input for spinning earth
      earth.mX.initial = mouseX;
      earth.mY.initial = mouseY;
};

function mouseReleased(){
      earth.mX.end = mouseX;
      earth.mY.end = mouseY;
};

function mouseWheel(event){
      scale = scale - (event.delta/1000)
};

