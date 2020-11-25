

(function () {
  
  if (typeof (W.map.thEnabled) == 'undefined') {
    W.map.thEnabled = false;
    thEnable();
  } else {
    if (W.map.thEnabled) {
      thDisable();
    } else {
      thEnable();
    }

  }

  var canvas = document.getElementById('WazeMap');
  var defaultPanInPixel = W.map.DEFAULT_PAN_IN_PIXEL;
  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;

  function thEnable() {
    var canvas = document.getElementById('WazeMap');
    W.map.thEnabled = true;
    W.map.events.listeners.moveendInitial = W.map.events.listeners.moveend;

    canvas.onmousedown = function () {
      W.map.events.listeners.moveendPreserved = W.map.events.listeners.moveend;
      W.map.events.listeners.moveend = null;
      console.log('mousedown');
      canvas.requestPointerLock();
    }


    canvas.onmouseup = function () {
      console.log('mouseup');
      document.removeEventListener("mousemove", updatePosition, false);
      W.map.events.listeners.moveend = W.map.events.listeners.moveendPreserved;
      if (W.map.events.listeners.moveend == null) {
        console.log("moveend restored from initial");
        W.map.events.listeners.moveend = W.map.events.listeners.moveendInitial;
      }
      W.map.events.triggerEvent("moveend",null)
      document.exitPointerLock();
    }

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    console.log('Trackpad Helper enabled.');
  }

  function thDisable() {
    var canvas = document.getElementById('WazeMap');
    W.map.thEnabled = false;
    document.exitPointerLock();
    canvas.onmousedown = null;
    canvas.mouseup = null;
    console.log('Trackpad Helper disabled.');
  }



  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);
    }
  }

  function updatePosition(e) {
    x = e.movementX;
    y = e.movementY;

    if (x != 0) {
      W.map.DEFAULT_PAN_IN_PIXEL = Math.abs(x);
      if (x > 0) {
        W.map.panLeft();
      } else {
        W.map.panRight();
      }
    }

    if (y != 0) {
      W.map.DEFAULT_PAN_IN_PIXEL = Math.abs(y);
      if (y > 0) {
        W.map.panUp();
      } else {
        W.map.panDown();
      }

    }

    W.map.DEFAULT_PAN_IN_PIXEL = defaultPanInPixel

  }
})();
