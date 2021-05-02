// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');
const submit_button = document.querySelector("[type='submit']");
const clear_button = document.querySelector("[type='reset']");
const read_button = document.querySelector("[type='button']");
const voice_select = document.getElementById("voice-selection");
const image_input = document.getElementById('image-input');
const meme_form = document.getElementById('generate-meme');
const volume_slide = document.querySelector("[type='range']");
const volume_icon = document.querySelector("[id='volume-group']>img");

//fill the voice select input
voice_select.disabled = false;
let voices;

//fires when voice options are ready to upload
speechSynthesis.addEventListener("voiceschanged", () => {
  voices = speechSynthesis.getVoices();
  for(let i = 0; i < voices.length; i++){
    let option = document.createElement('option');
    option.textContent = voices[i].name + '(' + voices[i].lang + ')';

    if(voices[i].default){
      option.textContent += ' -- DEFAULT';
      option.selected = true;
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voice_select.appendChild(option);
  }
 // console.log(voices);
});

//fires when read button is clicked
read_button.addEventListener('click', () => {
  //get text values from inputs
  let textTop = document.getElementById('text-top');
  let textBottom = document.getElementById('text-bottom');

  let textTop_text = textTop.value;
  let textBottom_text = textBottom.value;

  let utterTop = new SpeechSynthesisUtterance(textTop_text);
  let utterBottom = new SpeechSynthesisUtterance(textBottom_text);

  let selectedVoice = voice_select.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length; i++){
    if(voices[i].name == selectedVoice){
      utterTop.voice = voices[i];
      utterBottom.voice = voices[i];
    }
  }
  utterTop.volume = volume_slide.value/100;
  utterBottom.volume = volume_slide.value/100;

  speechSynthesis.speak(utterTop);
  speechSynthesis.speak(utterBottom);
});

//fires when volume is changed
volume_slide.addEventListener('input', () => {
  let currVolume = volume_slide.value;
  if(currVolume >= 67){
    volume_icon.src = "icons/volume-level-3.svg";
    volume_icon.alt = "Volume Level 3";
  } else if(currVolume >= 34){
    volume_icon.src = "icons/volume-level-2.svg";
    volume_icon.alt = "Volume Level 2";
  } else if (currVolume >= 1){
    volume_icon.src = "icons/volume-level-1.svg";
    volume_icon.alt = "Volume Level 1";
  } else{
    volume_icon.src = "icons/volume-level-0.svg";
    volume_icon.alt = "Volume Level 0";
  }
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  //console.log("Image loaded");

  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //toggle buttons
  submit_button.disabled = false;
  clear_button.disabled = true;
  read_button.disabled = true;

  //fill canvas
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fill();

  //draw uploaded image
  let newDims = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, newDims.startX, newDims.startY, newDims.width, newDims.height);
});

//fires when image input is changed
image_input.addEventListener('change', () => {
  let input_file = image_input.files[0];
  img.src = URL.createObjectURL(input_file);
  img.alt = input_file.name;

  //console.log("File Uploaded");
  //console.log(input_file);
  //console.log(img);
});


//fires when form is submited
meme_form.addEventListener('submit', (e) => {
  //stop button from refreshing the form
  e.preventDefault();

  //get text values from inputs
  let textTop = document.getElementById('text-top');
  let textBottom = document.getElementById('text-bottom');

  let textTop_text = textTop.value;
  let textBottom_text = textBottom.value;

  //write text to meme
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.strokeText(textTop_text, canvas.width/2, 60);
  context.fillText(textTop_text, canvas.width/2, 60);
  context.strokeText(textBottom_text, canvas.width/2, canvas.height - 30);
  context.fillText(textBottom_text, canvas.width/2, canvas.height - 30);

  //toggle buttons
  submit_button.disabled = true;
  clear_button.disabled = false;
  read_button.disabled = false;
});

//fires when clear button is clicked
clear_button.addEventListener('click', () => {
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //toggle buttons
  submit_button.disabled = false;
  clear_button.disabled = true;
  read_button.disabled = true;
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}