(function() {

  "use strict";
  
  let dbRoot = firebase.firestore();
  let db = dbRoot.collection('toolkit');
  let dbVisuals = db.doc('visuals');
  let dbAudio = db.doc('audio');
  let dbAudioDiscrete = db.doc('audioDiscrete');
  // let visualPicker = document.getElementById('visPicker');
  let audioPicker = document.getElementById('audio');
  let visSpeed = new Control('visSpeed');
  let visDelta = new Control('visDelta');
  let visStim = new Control('visStim');
  let noiseVol = new Control('noiseVol');
  let tone1Vol = new Control('tone1Vol');
  let tone1Freq = new Control('tone1Freq');
  let tone1TremType = new Control('tone1TremType');
  tone1TremType.selected = 'none';
  let tone1TremFreq = new Control('tone1TremFreq');
  let tone1TremSpread = new Control('tone1TremSpread');
  let noiseToggle = {};
  noiseToggle.on = document.getElementById('noiseOn');
  noiseToggle.off = document.getElementById('noiseOff');
  let tone1Toggle = {};
  tone1Toggle.on = document.getElementById('tone1On');
  tone1Toggle.off = document.getElementById('tone1Off');
  let tone1TremToggle = {};
  tone1TremToggle.on = document.getElementById('tone1TremOn');
  tone1TremToggle.off = document.getElementById('tone1TremOff');
  let visFeedMode = {};
  visFeedMode.monitor = document.getElementById('visMonitor');
  visFeedMode.preview = document.getElementById('visPreview');
  visFeedMode.off = document.getElementById('visFeedOff');
  let audFeedMode = {};
  audFeedMode.monitor = document.getElementById('audMonitor');
  audFeedMode.preview = document.getElementById('audPreview');
  audFeedMode.off = document.getElementById('audFeedOff');


/////////////////////
  let noiseEnv = new Tone.AmplitudeEnvelope(.1,.2,1,.8).toMaster();
  let noise = new Tone.Noise('brown').connect(noiseEnv);
  let tone1Env = new Tone.AmplitudeEnvelope(.1,.2,1,.8).toMaster();
  let tone1Trem = new Tone.Tremolo(4, 1).connect(tone1Env);
  tone1Trem.wet.value = 1;
  let tone1 = new Tone.Oscillator(440, 'sine').connect(tone1Trem);
/////////////////////

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
  snapBtn.onmousedown = audDiscrete;
  pointsBtn.onmousedown = audDiscrete;
  noiseToggle.on.onclick = noiseOn;
  noiseToggle.off.onclick = noiseOff;
  noiseVol.slider.oninput = noiseVolChange;
  tone1Toggle.on.onclick = tone1On;
  tone1Toggle.off.onclick = tone1Off;
  tone1TremToggle.on.onclick = tone1TremOn;
  tone1TremToggle.off.onclick = tone1TremOff;
  tone1Vol.slider.oninput = tone1VolChange;
  tone1Freq.slider.oninput = tone1FreqChange;
  tone1TremFreq.slider.oninput = tone1TremFreqChange;
  tone1TremSpread.slider.oninput = tone1TremSpreadChange;
  // tone2VolSlider.onchange = tone2Change;
  // tone2Toggle.onclick = tone2Change;
  // tone2FreqSlider.onchange = tone2Change;
  // musicBoxToggle.onclick = musicBoxChange;
  // musicBoxVol.slider.onchange = musicBoxChange;
  gallery.onclick = pickVis;

  tone1TremType.new.onchange = tremTypeSelect;
  audExecute.onclick = audChange;
  // audReset.onclick = audResetExec;
  visFeedMode.monitor.onclick = visMonitorOn;
  // visFeedMode.preview.onclick = visPreviewOn;
  visFeedMode.off.onclick = visFeedOff;
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

  function audMonitorOn() {
    Tone.Master.mute = true;
  }

  function audPreviewOn() {
    Tone.Master.mute = false;
  }

  function audFeedOff() {
    Tone.Master.mute = true;
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
      noise.volume.value = noiseVol.slider.valueAsNumber;
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
    noise.volume.value = noiseVol.slider.valueAsNumber;
  }


  function tone1On() {
    if (tone1.state != 'started') {
      tone1.volume.value = tone1Vol.slider.valueAsNumber;
      tone1.frequency.value = tone1Freq.slider.valueAsNumber ** freqExp;
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
    tone1Trem.frequency.value = 2 * (10 ** tone1TremFreq.slider.valueAsNumber);
    tone1Trem.spread = tone1TremSpread.slider.valueAsNumber * 1.8;
    tone1Trem.start();
  }

  function tone1TremOff() {
    tone1Trem.stop();
  }

  function tone1TremFreqChange() {
    tone1Trem.frequency.value = 2 * (10 ** tone1TremFreq.slider.valueAsNumber);
  }

  function tone1TremSpreadChange() {
    tone1Trem.spread = tone1TremSpread.slider.valueAsNumber * 1.8;
  }

  function tone1VolChange() {
    tone1.volume.value = tone1Vol.slider.valueAsNumber;
  }

  function tone1FreqChange() {
    tone1.frequency.value = tone1Freq.slider.valueAsNumber ** freqExp;
  }
  
  
  function tremTypeSelect(ev) {
    tone1Trem.type = ev.target.value;
    tone1TremType.selected = ev.target.value;
    }

/* 

    function audChange() {
      db.doc('noise').update({
        'on': document.getElementById('noiseOn').checked,
        'volume': noiseVol.slider.valueAsNumber,
      });
    
      db.doc('tone1').update({
        'on': document.getElementById('tone1On').checked,
        'volume': tone1Vol.slider.valueAsNumber,
        'freq': tone1Freq.slider.valueAsNumber ** freqExp,
        'trem.on': document.getElementById('tone1TremOn').checked,
        'trem.freq': 2 * (10 ** tone1TremFreq.slider.valueAsNumber),
        'trem.spread': tone1TremSpread.slider.valueAsNumber * 1.8,
        'trem.type': tone1TremType.selected
      });
    }

 */


  function Control(id) {
    this.id = id;
    this.curr = document.getElementById(id + 'Curr');
    this.new = document.getElementById(id + 'New');
    this.slider = document.getElementById(id + 'Slider');
    // this.slider.oninput = this.update();
    // this.update() = {
    // }
    // this.units;
    // this.convert = function(unitless) {
    //   let covereted = Math.round(this.slider.valueAsNumber);
    //   if (unitless) {
    //     return convereted;
    //   } else {
    //     return converted + ' Hz';
    //   }

    // }
    // this.update = function() {
    //   this.new.innerText = this.convert() + ;
    }



  function visResetExec() {
    visuals.newStim = 'none';
    visStim.new.innerHTML = visuals.newStim;
    visChange();
  }
  


  function audDiscrete(ev) {
    dbAudioDiscrete.update({
      [ev.target.id]: true
    });
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
    if (!visSpeed.slider.getAttribute('disabled')) {
      if (visuals.newStim == 'flasher') {
        let speed = (Math.pow(2, visSpeed.slider.valueAsNumber)/4);
        speed = speed.toFixed(1-Math.floor(Math.log10(speed)));
        visSpeed.new.innerHTML = speed + ' Hz';
      } else if (visuals.newStim == 'metronome') {
        let speed = Math.round((Math.pow(2, (visSpeed.slider.valueAsNumber * 2/3))*15));
        visSpeed.new.innerHTML = speed + ' bpm';
      } else if (visuals.newStim == 'colorsLights') {
        let speed = Math.round(16 - ((visSpeed.slider.valueAsNumber * 2) + 2));
        visSpeed.new.innerHTML = speed + 's';
      } else {
        visSpeed.new.innerHTML = Math.round(visSpeed.slider.valueAsNumber);
      }
    } else {
      visSpeed.new.innerHTML = '-';
    }
  }
  
  function visDeltaUpdate() {
    if (!visDelta.slider.getAttribute('disabled')) {
      let delta = visDelta.slider.valueAsNumber;
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
    } else {
      visDelta.new.innerHTML = '-';
    }
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
          visSpeed.slider.removeAttribute('disabled');
          visDelta.slider.removeAttribute('disabled');
          visSpeedUpdate();
          visDeltaUpdate();
          break;
        case 'colorsLights':
          if (visuals.stim == 'colorsLights') {
            visSpeed.slider.setAttribute('disabled',true);
            visSpeed.new.innerHTML = 'n/a';
          } else {
            visSpeed.slider.removeAttribute('disabled');
            visSpeedUpdate();
          }
          visDelta.slider.setAttribute('disabled',true);
          visDelta.new.innerHTML = 'n/a';
          break;
        default:
          visSpeed.slider.setAttribute('disabled',true);
          visDelta.slider.setAttribute('disabled',true);
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
          visuals.speed = 16 - ((visSpeed.slider.valueAsNumber * 2) + 2);
          visSpeed.slider.setAttribute('disabled',true);
          visSpeed.new.innerHTML = 'n/a';
        } else if (visuals.stim == 'flasher') {
          visuals.speed = 4000/Math.pow(2, visSpeed.slider.valueAsNumber);
        } else if (visuals.stim == 'metronome') {
          visuals.speed = 4000/(2 ** (visSpeed.slider.valueAsNumber * 2/3));
        } else if (visuals.stim == 'chaser') {
          visuals.speed = 8000/(2 ** (visSpeed.slider.valueAsNumber));
        }
      }
      visuals.delta = visDelta.slider.valueAsNumber;
      if (visuals.delta < 1) {
        visuals.delta = Math.round(2 * visuals.delta)*1000;
      } else {
        visuals.delta = 3750*Math.pow(2, visuals.delta);
      }
      visDelta.curr.innerHTML = visDelta.new.innerHTML;
    dbVisuals.update({
      'stim': visuals.stim,
      'speed': visuals.speed,
      'delta': visuals.delta,
      'colors': visuals.colors    
    });
  }


  function audChange() {
    db.doc('noise').update({
      'on': noiseToggle.on.checked,
      'volume': noiseVol.slider.valueAsNumber,
    });
  
    db.doc('tone1').update({
      'on': tone1Toggle.on.checked,
      'volume': tone1Vol.slider.valueAsNumber,
      'freq': tone1Freq.slider.valueAsNumber ** freqExp,
      'trem.on': tone1TremToggle.on.checked,
      'trem.freq': 2 * (10 ** tone1TremFreq.slider.valueAsNumber),
      'trem.spread': tone1TremSpread.slider.valueAsNumber * 1.8,
      'trem.type': tone1TremType.selected
    });
  }




// function tone2Change() {
//   db.doc('tone2').update({
//     'on': tone2Toggle.checked,
//     'volume': tone2VolSlider.valueAsNumber,
//     'freq': tone2FreqSlider.valueAsNumber ** freqExp
//   });
// }

let freqExp = 4;

  // function musicBoxChange() {
  //   db.doc('musicBox').update({
  //     'on': musicBoxToggle.checked,
  //     'volume': musicBoxVolume.slider.valueAsNumber
  //   });
  // }


})();
