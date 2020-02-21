(function() {

  "use strict";

  class Control {
    constructor(id, minVal = 0, maxVal = 1, initVal = 0, knobSize = 40) {
      this.id = id;
      this.curr = document.getElementById(id + 'Curr');
      this.new = document.getElementById(id + 'New');
      if (document.getElementById(id + 'Slider')) {
        this.slider = new PrecisionInputs.FLReactiveGripDial(document.getElementById(id + 'Slider'), {
          min: minVal,
          max: maxVal,
          initial: initVal
        });
        // this.slider.setAttribute('style',`height:${knobSize}px; width:${knobSize}px;`);
      }
      this.yoke1 = document.getElementById(id + 'Yoke1');
      controls.push(this);
      // this.slider.oninput = this.update();
      // this.update() = {
      // }
      // this.units;
      // this.convert = function(unitless) {
      //   let covereted = Math.round(this.slider.value);
      //   if (unitless) {
      //     return convereted;
      //   } else {
      //     return converted + ' Hz';
      //   }
      // }
      // this.update = function() {
      //   this.new.innerText = this.convert() + ;
    }
  }

  let dbRoot = firebase.firestore();
  let db = dbRoot.collection('toolkit');
  let dbVisuals = db.doc('visuals');
  let dbSpritz = db.doc('spritzer');
  let dbAudio = db.doc('audio');
  // let visualPicker = document.getElementById('visPicker');
  let audioPicker = document.getElementById('audio');
  let controls = [];
  let visSpeed = new Control('visSpeed',0,6,2);
  let visDelta = new Control('visDelta',0,6,0);
  let visStim = new Control('visStim');
  let spritzSpeed = new Control('spritzSpeed',1,4,3.198657087);
  let spritzText = new Control('spritzText');
  spritzText.selected = 'sine';

  let noiseVol = new Control('noiseVol',-50,0,-40);
  let noiseTremType = new Control('noiseTremType');
  noiseTremType.selected = 'sine';
  let noiseTremFreq = new Control('noiseTremFreq',-1,2,0);
  let noiseTremSpread = new Control('noiseTremSpread',0,100,0);

  let spritzToggle = {};
  spritzToggle.on = document.getElementById('spritzOn');
  spritzToggle.off = document.getElementById('spritzOff');
  let noiseToggle = {};
  noiseToggle.on = document.getElementById('noiseOn');
  noiseToggle.off = document.getElementById('noiseOff');
  // let noiseTremToggle = {};
  // noiseTremToggle.on = document.getElementById('noiseTremOn');
  // noiseTremToggle.off = document.getElementById('noiseTremOff');
  let visFeedMode = {};
  visFeedMode.monitor = document.getElementById('visMonitor');
  visFeedMode.preview = document.getElementById('visPreview');
  visFeedMode.off = document.getElementById('visFeedOff');
  let audFeedMode = {};
  audFeedMode.monitor = document.getElementById('audMonitor');
  audFeedMode.preview = document.getElementById('audPreview');
  audFeedMode.off = document.getElementById('audFeedOff');
  let visFeed = document.getElementById('visFeed');


/////////////////////
  let noiseEnv = new Tone.AmplitudeEnvelope(.2,.2,1,.8).toMaster();
  let noiseTrem = new Tone.Tremolo(4, 1).connect(noiseEnv);
  noiseTrem.wet.value = 1;
  let noise = new Tone.Noise('brown').connect(noiseTrem);


  /////////////////////
  // let master1 = new Control('master1');
  // master1.slider.oninput = master1Change;

  // let musicBoxVol = new Control('musicBoxVol');
  // let musicBoxRate = new Control('musicBoxRate');
  
  
  // let visStim.curr = document.getElementById('visStim.curr');
  // let visStim.new = document.getElementById('visStim.new');
  let visExecute = document.getElementById('visExecute');
  let visReset = document.getElementById('visReset');
  let audExecute = document.getElementById('audExecute');
  let audReset = document.getElementById('audReset');
  let snapBtn = document.getElementById('snap');
  let pointsBtn = document.getElementById('points');
  // let wordsToggle = document.getElementById('words');

  // let noiseToggle = document.getElementById("noiseToggle");
      // noise1Pan = document.getElementById("noisePan");
  // let tone1Toggle = document.getElementById("tone1Toggle");
  // let tone1TremToggle = document.getElementById("tone1TremToggle");
      // tone1Pan = document.getElementById("tone1Pan");
  // let tone2Toggle = document.getElementById("tone2"),
  //     tone2VolSlider = document.getElementById('tone2Vol'),
  //     tone2FreqSlider = document.getElementById('tone2Freq');
  let musicBoxToggle = document.getElementById("music-box");
  let gallery = document.getElementById('gallery');

  let visuals = {
    newStim: 'none',
    stim: 'none',
    speed: 1000,
    delta: 0,
    colors: ['white']
  };

  visExecute.onclick = visChange;
  visReset.onclick = visResetExec;
  visSpeed.slider.oninput = visSpeedUpdate;
  visDelta.slider.oninput = visDeltaUpdate;
  noiseToggle.on.onclick = noiseOn;
  noiseToggle.off.onclick = noiseOff;
  noiseVol.slider.oninput = noiseVolChange;
  

  // noiseTremToggle.on.onclick = noiseTremOn;
  // noiseTremToggle.off.onclick = noiseTremOff;
  noiseTremFreq.slider.oninput = noiseTremFreqChange;
  noiseTremSpread.slider.oninput = noiseTremSpreadChange;
  // tone2VolSlider.onchange = tone2Change;
  // tone2Toggle.onclick = tone2Change;
  // tone2FreqSlider.onchange = tone2Change;
  // musicBoxToggle.onclick = musicBoxChange;
  // musicBoxVol.slider.onchange = musicBoxChange;
  gallery.onclick = pickVis;
  // wordsToggle.onclick = wordsChange;


  audExecute.onclick = audChange;
  noiseTremType.new.onchange = noiseTremTypeSelect;
  audReset.onclick = audResetExec;
  // visFeedMode.monitor.onclick = visMonitorOn;
  // visFeedMode.preview.onclick = visPreviewOn;
  // visFeedMode.off.onclick = visFeedOff;
  audFeedMode.monitor.onclick = audMonitorOn;
  audFeedMode.preview.onclick = audPreviewOn;
  audFeedMode.off.onclick = audFeedOff;


  
  function visMonitorOn() {
    //
  }

  function visPreviewOn() {
    //
  }

  function visFeedOff() {
    //
  }
  let visFeedOn = true;
  function audMonitorOn() {
    Tone.Master.mute = true;
    if (!visFeedOn) {
      visFeed.src = 'display.html';
      visFeedOn = true;
    }
  }

  function audPreviewOn() {
    Tone.Master.mute = false;
    console.log(visFeed.src);
    if (!visFeedOn) {
      visFeed.src = 'display.html';
      visFeedOn = true;
    }
  }

  function audFeedOff() {
    Tone.Master.mute = true;
    visFeedOn = false;
    visFeed.src = 'blank.html';
  }



/*   noiseToggle.onclick = noiseTog;
  noiseVol.slider.oninput = noiseChange;
  tone1Toggle.onclick = tone1Tog;
  tone1Vol.slider.oninput = tone1Change;
  tone1Freq.slider.oninput = tone1Change;
  tone2VolSlider.onchange = tone2Change;
  tone1TremType.new.onchange = tremTypeSelect;
 */

  function noiseOn() {
    if (noise.state != 'started') {
      noise.volume.value = noiseVol.slider.value;
      noise.start();
      noiseEnv.triggerAttack();
    }
  }

  function noiseOff() {
    if (noise.state == 'started') {
      noiseEnv.triggerRelease();
      setTimeout(noiseStop, 500);
    }
  }

  function noiseStop() {
    noise.stop();
  }

  function noiseVolChange() {
    noise.volume.value = noiseVol.slider.value;
  }

  function master1Change() {
    master1.value = master1.slider.value;
    controls.forEach((ctl) => {
      if (ctl.yoke1.checked) {
        ctl.slider.value = (master1.value * (ctl.slider.max - ctl.slider.min)) + ctl.slider.min;
      }
    });
  }
  
  function noiseTremOn() {
    noiseTrem.frequency.value = 2 * (10 ** noiseTremFreq.slider.value);
    noiseTrem.spread = noiseTremSpread.slider.value * 1.8;
    noiseTrem.start();
  }

  function noiseTremOff() {
    noiseTrem.stop();
  }

  function noiseTremFreqChange() {
    noiseTrem.frequency.value = 2 * (10 ** noiseTremFreq.slider.value);
  }

  function noiseTremSpreadChange() {
    noiseTrem.spread = noiseTremSpread.slider.value * 1.8;
  }


  function noiseTremTypeSelect(ev) {
    noiseTrem.type = ev.target.value;
    noiseTremType.selected = ev.target.value;
    }


  
  let tone1Vol = new Control('tone1Vol',-50,0,-40);
  let tone1Freq = new Control('tone1Freq',2.5,6,3);
  let tone1TremType = new Control('tone1TremType');
  tone1TremType.selected = 'sine';
  let tone1TremFreq = new Control('tone1TremFreq',-1,2,0);
  let tone1TremSpread = new Control('tone1TremSpread',0,100,0);
  let tone1Toggle = {};
  tone1Toggle.on = document.getElementById('tone1On');
  tone1Toggle.off = document.getElementById('tone1Off');
  // let tone1TremToggle = {};
  // tone1TremToggle.on = document.getElementById('tone1TremOn');
  // tone1TremToggle.off = document.getElementById('tone1TremOff');
  let tone1Env = new Tone.AmplitudeEnvelope(.2,.2,1,.8).toMaster();
  let tone1Trem = new Tone.Tremolo(4, 1).connect(tone1Env);
  tone1Trem.wet.value = 1;
  let tone1 = new Tone.Oscillator(440, 'sine').connect(tone1Trem);
  tone1Toggle.on.onclick = tone1On;
  tone1Toggle.off.onclick = tone1Off;
  // tone1TremToggle.on.onclick = tone1TremOn;
  // tone1TremToggle.off.onclick = tone1TremOff;
  tone1Vol.slider.oninput = tone1VolChange;
  // tone1Freq.slider.onchange = tone1FreqChange;
  tone1Freq.slider.oninput = tone1FreqChange;

  tone1TremFreq.slider.oninput = tone1TremFreqChange;
  tone1TremSpread.slider.oninput = tone1TremSpreadChange;
  tone1TremType.new.onchange = tone1TremTypeSelect;


  function tone1On() {
    if (tone1.state != 'started') {
      tone1.volume.value = tone1Vol.slider.value;
      tone1.frequency.value = tone1Freq.slider.value ** freqExp;
      tone1.start();
      tone1Env.triggerAttack();
    }
  }

  function tone1Off() {
    if (tone1.state == 'started') {
      tone1Env.triggerRelease();
      setTimeout(tone1Stop, 500);
    }
  }

  function tone1Stop() {
    tone1.stop();
  }
  
  function tone1TremOn() {
    tone1Trem.frequency.value = 2 * (10 ** tone1TremFreq.slider.value);
    tone1Trem.spread = tone1TremSpread.slider.value * 1.8;
    tone1Trem.start();
  }

  function tone1TremOff() {
    tone1Trem.stop();
  }

  function tone1TremFreqChange() {
    tone1Trem.frequency.value = 2 * (10 ** tone1TremFreq.slider.value);
  }

  function tone1TremSpreadChange() {
    tone1Trem.spread = tone1TremSpread.slider.value * 1.8;
  }

  function tone1VolChange() {
    tone1.volume.value = tone1Vol.slider.value;
  }

  function tone1FreqChange() {
    tone1.frequency.value = tone1Freq.slider.value ** freqExp;
  }
  
  
  function tone1TremTypeSelect(ev) {
    tone1Trem.type = ev.target.value;
    tone1TremType.selected = ev.target.value;
    }


  
    let tone2Vol = new Control('tone2Vol',-50,0,-40);
    let tone2Freq = new Control('tone2Freq',2.5,6,3);
    let tone2TremType = new Control('tone2TremType');
    tone2TremType.selected = 'sine';
    let tone2TremFreq = new Control('tone2TremFreq',-1,2,0);
    let tone2TremSpread = new Control('tone2TremSpread',0,100,0);
    let tone2Toggle = {};
    tone2Toggle.on = document.getElementById('tone2On');
    tone2Toggle.off = document.getElementById('tone2Off');
    // let tone2TremToggle = {};
    // tone2TremToggle.on = document.getElementById('tone2TremOn');
    // tone2TremToggle.off = document.getElementById('tone2TremOff');
    let tone2Env = new Tone.AmplitudeEnvelope(.2,.2,1,.8).toMaster();
    let tone2Trem = new Tone.Tremolo(4, 1).connect(tone2Env);
    tone2Trem.wet.value = 1;
    let tone2 = new Tone.Oscillator(440, 'sine').connect(tone2Trem);
    tone2Toggle.on.onclick = tone2On;
    tone2Toggle.off.onclick = tone2Off;
    // tone2TremToggle.on.onclick = tone2TremOn;
    // tone2TremToggle.off.onclick = tone2TremOff;
    tone2Vol.slider.oninput = tone2VolChange;
    tone2Freq.slider.oninput = tone2FreqChange;
    tone2TremFreq.slider.oninput = tone2TremFreqChange;
    tone2TremSpread.slider.oninput = tone2TremSpreadChange;
    tone2TremType.new.onchange = tone2TremTypeSelect;
  
  
    function tone2On() {
      if (tone2.state != 'started') {
        tone2.volume.value = tone2Vol.slider.value;
        tone2.frequency.value = tone2Freq.slider.value ** freqExp;
        tone2.start();
        tone2Env.triggerAttack();
      }
    }
  
    function tone2Off() {
      if (tone2.state == 'started') {
        tone2Env.triggerRelease();
        setTimeout(tone2Stop, 500);
      }
    }
  
    function tone2Stop() {
      tone2.stop();
    }
    
    function tone2TremOn() {
      tone2Trem.frequency.value = 2 * (10 ** tone2TremFreq.slider.value);
      tone2Trem.spread = tone2TremSpread.slider.value * 1.8;
      tone2Trem.start();
    }
  
    function tone2TremOff() {
      tone2Trem.stop();
    }
  
    function tone2TremFreqChange() {
      tone2Trem.frequency.value = 2 * (10 ** tone2TremFreq.slider.value);
    }
  
    function tone2TremSpreadChange() {
      tone2Trem.spread = tone2TremSpread.slider.value * 1.8;
    }
  
    function tone2VolChange() {
      tone2.volume.value = tone2Vol.slider.value;
    }
  
    function tone2FreqChange() {
      tone2.frequency.value = tone2Freq.slider.value ** freqExp;
    }
    
    
    function tone2TremTypeSelect(ev) {
      tone2Trem.type = ev.target.value;
      tone2TremType.selected = ev.target.value;
      }
  
    

  /*
  
      function audChange() {
        db.doc('noise').update({
          'on': document.getElementById('noiseOn').checked,
          'volume': noiseVol.slider.value,
        });
      
        db.doc('tone1').update({
          'on': document.getElementById('tone1On').checked,
          'volume': tone1Vol.slider.value,
          'freq': tone1Freq.slider.value ** freqExp,
          'trem.on': document.getElementById('tone1TremOn').checked,
          'trem.freq': 2 * (10 ** tone1TremFreq.slider.value),
          'trem.spread': tone1TremSpread.slider.value * 1.8,
          'trem.type': tone1TremType.selected
        });
      }
  
   */




  function visResetExec() {
    visuals.newStim = 'none';
    visStim.new.innerHTML = visuals.newStim;
    visChange();
  }
  
  function audResetExec() {
    noiseToggle.off.checked = true;
    // noiseTremToggle.off.checked = true;
    tone1Toggle.off.checked = true;
    // tone1TremToggle.off.checked = true;
    tone2Toggle.off.checked = true;
    // tone2TremToggle.off.checked = true;
    tone1Off();
    tone1TremOff();
    tone2Off();
    tone2TremOff();
    noiseOff();
    noiseTremOff();
    audChange();
  }

  // visSelects.forEach(function(visSelect) {
  //   visSelect.addEventListener('click',function(){
  //     pickVis(visSelect.id);
  //   });
  // });


  // visSpeed.slider.setAttribute('disabled',true);
  // visSpeedUpdate();
  // visDelta.slider.setAttribute('disabled',true);
  // visDeltaUpdate();
  // // pickVis('none');
  // visChange();

  function visSpeedUpdate() {
    // if (!visSpeed.slider.getAttribute('disabled')) {
      if (visuals.newStim == 'flasher') {
        let speed = (Math.pow(2, visSpeed.slider.value)/4);
        speed = speed.toFixed(1-Math.floor(Math.log10(speed)));
        visSpeed.new.innerHTML = speed + ' Hz';
      } else if (visuals.newStim == 'metronome') {
        let speed = Math.round((Math.pow(2, (visSpeed.slider.value * 2/3))*15));
        visSpeed.new.innerHTML = speed + ' bpm';
      } else if (visuals.newStim == 'colorsLights') {
        let speed = Math.round(16 - ((visSpeed.slider.value * 2) + 2));
        visSpeed.new.innerHTML = speed + 's';
      } else {
        visSpeed.new.innerHTML = Math.round(visSpeed.slider.value);
      }
    // } else {
    //   visSpeed.new.innerHTML = '-';
    // }
  }
  
  function visDeltaUpdate() {
    // if (!visDelta.slider.getAttribute('disabled')) {
      let delta = visDelta.slider.value;
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
      visDelta.new.innerHTML = delta;
    // } else {
    //   visDelta.new.innerHTML = '-';
    // }
  }


  // visualPicker.onchange = changeVisPicker;

  function pickVis (ev) {
    if (ev.target.id != 'gallery') {
      visuals.newStim = ev.target.id;
      visStim.new.innerHTML = visuals.newStim;
      switch (visuals.newStim) {
        case 'metronome':
        case 'flasher':
        case 'chaser':
          // visSpeed.slider.removeAttribute('disabled');
          // visDelta.slider.removeAttribute('disabled');
          visSpeedUpdate();
          visDeltaUpdate();
          break;
        case 'colorsLights':
          if (visuals.stim == 'colorsLights') {
            // visSpeed.slider.setAttribute('disabled',true);
            visSpeed.new.innerHTML = 'n/a';
          } else {
            // visSpeed.slider.removeAttribute('disabled');
            visSpeedUpdate();
          }
          // visDelta.slider.setAttribute('disabled',true);
          visDelta.new.innerHTML = 'n/a';
          break;
        default:
          // visSpeed.slider.setAttribute('disabled',true);
          // visDelta.slider.setAttribute('disabled',true);
          visSpeed.new.innerHTML = 'n/a';
          visDelta.new.innerHTML = 'n/a';
        }  
      }
    }


/*       if (visuals.newStim == 'none') {
        visSpeed.slider.setAttribute('disabled',true);
        visSpeedUpdate();
        visDelta.slider.setAttribute('disabled',true);
        visDeltaUpdate();
      } else {
        visSpeed.slider.removeAttribute('disabled');
        visSpeedUpdate();
        visDelta.slider.removeAttribute('disabled');
        visDeltaUpdate();  
      }
    }
 */

  function visChange() {
      visuals.stim = visuals.newStim;
      // currVisPrev.innerHTML = newVisPrev.innerHTML;
      visStim.curr.innerHTML = visuals.newStim;
      if (!(visuals.stim == 'colorsLights' && visSpeed.slider.disabled)) {
        visSpeed.curr.innerHTML = visSpeed.new.innerHTML;
        if (visuals.stim == 'colorsLights') {
          visuals.speed = 16 - ((visSpeed.slider.value * 2) + 2);
          visSpeed.slider.setAttribute('disabled',true);
          visSpeed.new.innerHTML = 'n/a';
        } else if (visuals.stim == 'flasher') {
          visuals.speed = 4000/Math.pow(2, visSpeed.slider.value);
        } else if (visuals.stim == 'metronome') {
          visuals.speed = 4000/(2 ** (visSpeed.slider.value * 2/3));
        } else if (visuals.stim == 'chaser') {
          visuals.speed = 8000/(2 ** (visSpeed.slider.value));
        }
      }
      visuals.delta = visDelta.slider.value;
      if (visuals.delta < 1) {
        visuals.delta = Math.round(2 * visuals.delta)*1000;
      } else {
        visuals.delta = 3750*Math.pow(2, visuals.delta);
      }
      visDelta.curr.innerHTML = visDelta.new.innerHTML;
      spritzSpeed.curr.innerHTML = Math.round(Math.pow(10, spritzSpeed.slider.value) + 20)  + ' wpm';
    dbVisuals.update({
      'stim': visuals.stim,
      'speed': visuals.speed,
      'delta': visuals.delta,
      'colors': visuals.colors    
    });
    dbSpritz.update({
      'on': spritzToggle.on.checked,
      'speed': Math.pow(10, spritzSpeed.slider.value) + 20
    })
  }

  function audChange() {
    db.doc('noise').update({
      'on': noiseToggle.on.checked,
      'volume': noiseVol.slider.value,
      'trem.on': noiseTremType.selected != 'none',
      'trem.freq': 2 * (10 ** noiseTremFreq.slider.value),
      'trem.spread': noiseTremSpread.slider.value * 1.8,
      'trem.type': noiseTremType.selected
    });
  
    db.doc('tone1').update({
      'on': tone1Toggle.on.checked,
      'volume': tone1Vol.slider.value,
      'freq': tone1Freq.slider.value ** freqExp,
      'trem.on': tone1TremType.selected != 'none',
      'trem.freq': 2 * (10 ** tone1TremFreq.slider.value),
      'trem.spread': tone1TremSpread.slider.value * 1.8,
      'trem.type': tone1TremType.selected
    });

      
    db.doc('tone2').update({
      'on': tone2Toggle.on.checked,
      'volume': tone2Vol.slider.value,
      'freq': tone2Freq.slider.value ** freqExp,
      'trem.on': tone2TremType.selected != 'none',
      'trem.freq': 2 * (10 ** tone2TremFreq.slider.value),
      'trem.spread': tone2TremSpread.slider.value * 1.8,
      'trem.type': tone2TremType.selected
    });

  }
/* 
  function wordsChange() {
    db.doc('words').update({
      'on': wordsToggle.checked
    });
  } */



// function tone2Change() {
//   db.doc('tone2').update({
//     'on': tone2Toggle.checked,
//     'volume': tone2VolSlider.value,
//     'freq': tone2FreqSlider.value ** freqExp
//   });
// }

let freqExp = 4;

  // function musicBoxChange() {
  //   db.doc('musicBox').update({
  //     'on': musicBoxToggle.checked,
  //     'volume': musicBoxVolume.slider.value
  //   });
  // }


})();