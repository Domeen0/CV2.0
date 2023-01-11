var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

$(document).keypress(function(){
  if(!started){
    $("#level-title").text("Level " + level);
  nextSequence();
  started = true;
}
});

$(".btn").click(function(){
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  //console.log(userChosenColour);
playSound(userChosenColour);
animatePress(userChosenColour);
checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel){
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    console.log("Success");
    if(userClickedPattern.length === gamePattern.length){

      setTimeout(function(){
        nextSequence();
      },1000);
    }
  }else{
    playSound("wrong");      /*var audio_wrong = new Audio("sounds/wrong.mp3")
            audio_wrong.play();*/
      $("body").addClass("game-over");
      setTimeout(function(){
        $("body").removeClass("game-over");
        }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    console.log("Wrong");
    startOver();
  }
}
function startOver(){
  level = 0;
  gamePattern = [];
  started = false;
}

function nextSequence(){
  userClickedPattern =[];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(150).fadeOut(150).fadeIn(150); //blikání
  playSound(randomChosenColour);
}
function playSound(name){
    var audio = new Audio("sounds/"+ name + ".mp3")
    audio.play();
}

function animatePress(currentColour){
  $("#" + currentColour).addClass("pressed");
  setTimeout(function(){
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
