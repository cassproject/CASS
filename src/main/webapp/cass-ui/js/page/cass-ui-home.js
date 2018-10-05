//**************************************************************************************************
// CASS UI Home Page Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const CASSUI_FWK_EXP_PAGE = "cass-ui-framework-exp-ctr.html";
const CASSUI_PRF_EXP_PAGE = "cass-ui-profile-exp-ctr.html";
const CASSUI_GAP_ANL_PAGE = "cass-ui-gap-analysis-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function goToFrameworkExplorer() {
    location.replace(CASSUI_FWK_EXP_PAGE);
}

function goToProfileExplorer() {
    location.replace(CASSUI_PRF_EXP_PAGE);
}

function goToGapAnalysis() {
    location.replace(CASSUI_GAP_ANL_PAGE);
}

function init() {
    loadCassUiSessionState();
    setCassUiMainMenuUserName();
}

//**************************************************************************************************
// Bokeh circle display code   --- can move out of this js file if needed.
//**************************************************************************************************
const PARTICLE_AMOUNT = 150;
const PARTICLE_SIZE = 1;
const PARTICLE_SPEED = 5;
const MULTI_COLOR = true;
const BLEND_FILTER = false;

const C = document.querySelector("canvas");
C.width = window.innerWidth;
C.height = window.innerHeight;
const CTX = C.getContext("2d");

window.addEventListener("resize", () => {
  C.width = window.innerWidth;
  C.height = window.innerHeight;
  CTX.globalCompositeOperation = BLEND_FILTER ? "lighter" : "source-over";
});

const PARTICLES = [];

CTX.globalCompositeOperation = BLEND_FILTER ? "lighter" : "source-over";

class Particle {
  constructor(speed, distance, cos, sin, size, col) {
    this.speed = speed;
    this.distance = distance;
    this.x = 0;
    this.y = 0;
    this.cos = cos;
    this.sin = sin;
    this.size = size;
    this.col = col;
  }
}

function createStars() {
  for (let i = 0; i < PARTICLE_AMOUNT; i++) {
    PARTICLES.push(
      new Particle(getSpeed(), 20, getAngle(), getAngle(), getSize(), getCol())
    );
  }
  function getSpeed() {
    return Math.floor(Math.random() * PARTICLE_SPEED + 1);
  }
  function getAngle() {
    return Math.random() > 0.5 ? Math.random() : -Math.abs(Math.random());
  }
  function getSize() {
    return Math.floor(Math.random() * PARTICLE_SIZE + 15);
  }
  function getCol() {
    if (MULTI_COLOR) {
      var randomNum = Math.floor(Math.random() * (0+5));
      var color;
      switch(randomNum) {
        case 0: 
          color = 'rgb(17,116,154, .3)' ;
          break;
        case 1: 
          color= 'rgb(235,173,135, .3)';
          break;
        case 2: 
          color= 'rgb(179,106,121, .3)';
          break;
        case 3:
          color= 'rgb(76,193,187, .3)';
          break;        
        case 4:
          color= 'rgb(112,112,112, .3)';
          break;
        default: 
          color='rgb(17,116,154, .3)' ;
      }
      return color;
    } else {
      return "rgb(255,255,255)";
    }
  }
}

function loop() {
  CTX.clearRect(0, 0, C.width, C.height);
  PARTICLES.forEach(e => {
    CTX.fillStyle = e.col;
    CTX.beginPath();
    CTX.arc(e.x, e.y, e.size, e.distance, Math.PI * 2, true);
    e.distance += e.speed;
    e.x = C.width / 2 + e.distance * e.cos;
    e.y = C.height / 2 + e.distance * e.sin;
    if (e.x > C.width || e.x < 0 || e.y > C.height || e.y < 0) {
      e.x = C.width / 2;
      e.y = C.height / 2;
      e.distance = 0;
    }
    CTX.fill();
  });

  window.requestAnimationFrame(loop);
}

createStars();
window.requestAnimationFrame(loop);



//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
