(function() {

  "use strict";
  
  let dbRoot = firebase.firestore();
  let db = dbRoot.collection('toolkit');
  let dbVisuals = db.doc('visuals');
  let visualPicker = document.getElementById('visPicker');
  let audioPicker = document.getElementById('audio');
  let visSpeed = document.getElementById('visSpeed');
  let visDelta = document.getElementById('visDelta');
  let visSpeedNew = document.getElementById('visSpeedNew');
  let visDeltaNew = document.getElementById('visDeltaNew');
  let visSpeedCurr = document.getElementById('visSpeedCurr');
  let visDeltaCurr = document.getElementById('visDeltaCurr');
  let visStimCurr = document.getElementById('visStimCurr');
  let visExecute = document.getElementById('visExecute');
  let visReset = document.getElementById('visReset');
/*   let visuals = [
    {state:1}, //none 0
    {state:0}, //spiral1 1
    {state:0, rate:60}, //spiral2 2
    {state:0, rate:60, color:'255,255,255'}, //flasher 3
    {state:0, rate:60} //metronome 4
  ] */
  let visuals = {
    newStim: 'None',
    stim: 'None',
    speed: 1000,
    delta: 0,
    colors: ['white']
  };
  let audios = [
    {state:1}, //none 0
    {state:0, speed:1}, //noise 1
    {state:0, speed:1}, //binaural 2
    {state:0, speed:1}, //music box 3
    {state:0, rate:60}, //metronome 4
    {state:0, rate:60}, //tick tock 5
    {state:0, rate:60} //tone 6
  ]
  audios.active = 0;
  let noise = new Audio('audio/noise.mp3');
  let binaural = new Audio('audio/binbeat.mp3');
  let musicbox = new Audio('audio/musicbox.mp3');

  // dbVisuals.doc('none').update({state:1});
  // dbVisuals.doc('spiral1').update({state:0});
  // dbVisuals.doc('spiral2').update({state:0});
  // dbVisuals.doc('flasher').update({state:0});
  // dbVisuals.doc('metronome').update({state:0});

  visExecute.onclick = visChange;
  visSpeed.oninput = visSpeedUpdate;
  visDelta.oninput = visDeltaUpdate;

  visSpeed.setAttribute('disabled',true);
  visSpeedUpdate();
  visDelta.setAttribute('disabled',true);
  visDeltaUpdate();
  visChange();

  function visSpeedUpdate() {
/*     switch (true) {
      case !visSpeed.getAttribute('disabled'):
        break; */
/*     if (visSpeed.getAttribute('disabled')) {
      visSpeedNew.innerHTML = '-';
    } else if (visuals.newStim == 'Flasher') {
      visuals.speed = 4000/Math.pow(2, visSpeed.valueAsNumber); */
    if (!visSpeed.getAttribute('disabled')) {
      if (visuals.newStim == 'Flasher') {
        let speed = (Math.pow(2, visSpeed.valueAsNumber)/4);
        speed = speed.toFixed(1-Math.floor(Math.log10(speed)));
        visSpeedNew.innerHTML = speed + ' Hz';
      } else {
        let speed = Math.round((Math.pow(2, visSpeed.valueAsNumber)*15));
        if (visuals.newStim == 'Metronome') {
          visSpeedNew.innerHTML = speed + ' bpm';
        } else {
          visSpeedNew.innerHTML = speed + ' rpm';
        }
      }
    } else {
      visSpeedNew.innerHTML = '-';
    }
  }
  
  function visDeltaUpdate() {
    if (!visDelta.getAttribute('disabled')) {
      let delta = visDelta.valueAsNumber;
      if (delta < 1) {
        delta = Math.round(2 * delta)*1000;
      } else {
        delta = 3750*Math.pow(2, delta);
      }
      if (delta < 60500) {
        delta = Math.round(delta/1000) + 's';
      } else {
        delta = Math.floor(delta / 60000) + 'm ' + Math.round((delta % 60000)/1000) + 's';
      }
      visDeltaNew.innerHTML = delta;
    } else {
      visDeltaNew.innerHTML = '-';
    }
  }


/* 
  function visCommandUpdate() {
    if (visualPicker.options[e.selectedIndex].value == visuals.stim &&
      ;
    if (visuals.stim == 'none') {
//      visSpeed
    } else {
      visCommandReadout.innerHTML = 'stop all visuals?'
    }
  } */

  visualPicker.onchange = function(picker) {
    visuals.newStim = picker.target.value;
    // visuals.newStimText = picker.options[picker.selectedIndex].text
/*     switch (visuals.newStim) {
      case ('None'):
        visSpeed.setAttribute('disabled',true);
        visSpeedUpdate();
        visDelta.setAttribute('disabled',true);
        visDeltaUpdate();
        break;
      case ('Flasher'):
        visSpeed.removeAttribute('disabled');
        visSpeedUpdate();
        visDelta.removeAttribute('disabled');
        visDeltaUpdate();   */
    if (visuals.newStim == 'None') {
      visSpeed.setAttribute('disabled',true);
      visSpeedUpdate();
      visDelta.setAttribute('disabled',true);
      visDeltaUpdate();
    } else {
      visSpeed.removeAttribute('disabled');
      visSpeedUpdate();
      visDelta.removeAttribute('disabled');
      visDeltaUpdate();  
    }
  }  

   function visChange() {
    // if (visuals.stim != visuals.newStim) {
      visStimCurr.innerHTML = visuals.stim = visuals.newStim;
    // }
    // if (!visSpeed.getAttribute('disabled')) {
      visuals.speed = 4000/Math.pow(2, visSpeed.valueAsNumber);
      visSpeedCurr.innerHTML = visSpeedNew.innerHTML;
    // } else {
    //   visSpeedCurr.innerHTML = '-';
    // }
    // if (!visDelta.getAttribute('disabled')) { 
      visuals.delta = visDelta.valueAsNumber;
      if (visuals.delta < 1) {
        visuals.delta = Math.round(2 * visuals.delta)*1000;
      } else {
        visuals.delta = 3750*Math.pow(2, visuals.delta);
      }      
      visDeltaCurr.innerHTML = visDeltaNew.innerHTML;
    // } else {
    //   visDeltaCurr.innerHTML = '-';
    dbVisuals.update({
      'stim': visuals.stim,
      'speed': visuals.speed,
      'delta': visuals.delta,
      'colors': visuals.colors    
    });
  }







  





    // dbVisuals.doc(visuals.stim).update({state: 0});
    // dbVisuals.doc(selection).update({state: 1});


  // toolStates.spiral1 ^= 1;
  // toolsActive.update({spiral1: toolStates.spiral1})

    // let spiral1State = doc.get('spiral1');
    // console.log(spiral1State);
/*    if (spiral1State) {
      monitor1.innerHTML = 'spiral';
    } else {
      monitor1.innerHTML = '';
    } 
  }); */

/*  
  document.addEventListener('keydown', function(event) {
    console.log('keypress listener triggered');
    if (event.key.toLowerCase() == 'a') {
      toolStates.spiral1 ^= 1;
      toolsActive.update({spiral1: toolStates.spiral1})
      // .then(function() {console.log('update attempted & successful');})
      // .catch(function() {console.log('update attempted & failed');});
    }
  });

 */


  /* let statements = getData('2PACX-1vTEhAbNg63mnQFCBCPpuhwGU9KU1MnvvESo-UGzwyBFp1qW2A0K9Lccqr0FwlpI9ggECkZPpfdZoWZy', '518786786');
  function getData(docID, sheetID) {
    $.get('https://docs.google.com/spreadsheets/d/e/' + docID + '/pub?gid=' + sheetID + '&single=true&output=csv', function(data) {
      return $.csv.toObjects(data);
      check();
    });
  }
 */

/*   let statements = {};
//  getData(statements, '2PACX-1vTEhAbNg63mnQFCBCPpuhwGU9KU1MnvvESo-UGzwyBFp1qW2A0K9Lccqr0FwlpI9ggECkZPpfdZoWZy', '518786786');
//  setTimeout(check, 5000);


  $.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTEhAbNg63mnQFCBCPpuhwGU9KU1MnvvESo-UGzwyBFp1qW2A0K9Lccqr0FwlpI9ggECkZPpfdZoWZy/pub?gid=518786786&single=true&output=csv', function(data) {
    console.log(data);
    statements = $.csv.toObjects(data);
    console.log(statements);
    console.log(JSON.stringify(statements));
  });
 */
/*   function getData(varName, docID, sheetID) {
    $.get('https://docs.google.com/spreadsheets/d/e/' + docID + '/pub?gid=' + sheetID + '&single=true&output=csv', function(data) {
      varName = $.csv.toObjects(data);
    });
  }

  function check() {
    console.log(statements);
    console.log(JSON.stringify(statements));
  }
 */

})();