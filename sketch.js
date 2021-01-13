//Declaring the variables.
var dog,dogImg,dogHappy,bowl,bowlImg,empty_bowl;
var database,drinkSound,food,foodStock,emptyBowlImg;

//Function for preloading.
function preload(){
  //Loading images and sounds to different variables.
   dogImg = loadImage("Dog.png");
   dogHappy = loadImage("happy_dog.png");
   bowlImg = loadImage("bowl.png");
   emptyBowlImg = loadImage("empty_bowl.png");
   drinkSound = loadSound("drinkSound.wav");
}

//Function for setting up.
function setup() {
  //Setting database's value as the realtime firebase database's value.
  database = firebase.database();
  //Creating the canvas area.
  createCanvas(500,500);

  //Adjusting the volume for drinkSound.
  drinkSound.setVolume(0.07);

  //Creating sprites and assigning different properties for them.
  dog=createSprite(300,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;
  bowl = createSprite(240,335,30,10);
  bowl.addImage(bowlImg);
  bowl.scale = 0.4;

  //Joining foodStock variable with the 'Food' in realtime database.
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
}

//Draw loop function.
function draw() {
  //Changing the background color.
  background(46,139,87);
 
  //Calling the writeStock function when up arrow is pressed.
  if(keyWentDown(UP_ARROW)){
    writeStock(food);
    //Changing dog sprite's image to 'dogHappy'.
    dog.addImage(dogHappy);
    //Playing sound effect if food left is greater than 0.
    if(food > 0) {
      drinkSound.play();
    }
  }

  //Changing bowl sprite's image when food left is 0.
  if(food === 0) {
    bowl.addImage(emptyBowlImg);
  }

  //Resetting dog sprite's previous image when up arrow is released.
  if(keyWentUp(UP_ARROW)) {
    dog.addImage(dogImg);
  }

  //Resetting the food left to 20 and changing bowl sprite's image when ctrl key is pressed.
  if(keyDown("ctrl")) {
    food = 20;
    bowl.addImage(bowlImg);
  }

  //Displaying the spries.
  drawSprites();

  //Displaying the info text.
  fill("white");
  stroke("black");
  textSize(20);
  textAlign(CENTER);
  text("Food remaining : " + food,130,120);
  textSize(20);
  text("Note: Press Up Arrow key to feed your virtual pet,",250,30);
  text("Leo, Milk! Press 'Ctrl' key to reset.",250,55);
}

//readStock function for fetching the food left data from the realtime database.
function readStock(data){
  food = data.val();
}

//writeStock function for updating the food left data in realtime database.
function writeStock(x) {
  if(x <= 0) {
    x = 0;
  }
  else {
    x = x - 1;
  } 
  database.ref('/').update({
    Food:x
  })
}