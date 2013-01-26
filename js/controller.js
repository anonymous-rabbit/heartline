var _controller = function() {
	this.DIRECTION_EVENT = "Direction Event"
	this.JUMP_PRESS_EVENT = "Jump Event"
	this.JUMP_RELEASE_EVENT = "Jump Release Event"
	this.LIFT_PRESS__EVENT = "Lift Press Event"
	this.LIFT_RELEASE_EVENT = "Lift Release Event"

	this.dir =
	{
		'x': 0,
		'y': 0,
	}

	this.isLifting = false
	this.isJumping = false

	this.event_listeners = {}

	var player = null

};

var defaultPlayer1 =
{
	jump: 'Q'.charCodeAt(0),
	lift: 'E'.charCodeAt(0),
	left: 'A'.charCodeAt(0),
	right: 'D'.charCodeAt(0),
	up: 'W'.charCodeAt(0),
	down: 'S'.charCodeAt(0),
}

var defaultPlayer2 =
{
	jump: 'I'.charCodeAt(0),
	lift: 'P'.charCodeAt(0),
	left: 'K'.charCodeAt(0),
	right: ';'.charCodeAt(0),
	up: 'O'.charCodeAt(0),
	down: 'L'.charCodeAt(0),
}


var keyboard_controller = function(bindings)
{
	this.bindings = bindings

	for (var action in bindings)
		keyPressed[bindings[action]] = false;
}

var gamepad_buttons = {
  FACE_1: 0, // Face (main) buttons
  FACE_2: 1,
  FACE_3: 2,
  FACE_4: 3,
  LEFT_SHOULDER: 4, // Top shoulder buttons
  RIGHT_SHOULDER: 5,
  LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
  RIGHT_SHOULDER_BOTTOM: 7,
  SELECT: 8,
  START: 9,
  LEFT_ANALOGUE_STICK: 10, // Analogue sticks (if depressible)
  RIGHT_ANALOGUE_STICK: 11,
  PAD_TOP: 12, // Directional (discrete) pad
  PAD_BOTTOM: 13,
  PAD_LEFT: 14,
  PAD_RIGHT: 15
};

var gamepad_axes = {
  LEFT_ANALOGUE_HOR: 0,
  LEFT_ANALOGUE_VERT: 1,
  RIGHT_ANALOGUE_HOR: 2,
  RIGHT_ANALOGUE_VERT: 3
};

var gamepad_controller = function (controllerIndex, bindings)
{
	if (bindings == null)
	this.bindings =
	{
		up: gamepad_buttons.PAD_TOP,
		down: gamepad_buttons.PAD_BOTTOM,
		left: gamepad_buttons.PAD_LEFT,
		right: gamepad_buttons.PAD_RIGHT,
		jump: gamepad_buttons.FACE_1,
		lift: gamepad_buttons.FACE_3,
	}
	else
		this.bindings = bindings
	this.controllerIndex = controllerIndex
}

//Event Listeners recieve the controller object that triggered the event
_controller.prototype.addEventListener = function(event_name, event_listener)
{
	if (!this.event_listeners[event_name])
		this.event_listeners[event_name] = new Array()
	this.event_listeners[event_name].push(event_listener)
}

_controller.prototype.detach = function()
{
	this.event_listeners = {}
}

_controller.prototype.pause = function()
{
	this.paused = true
}

_controller.prototype.unpause = function()
{
	this.paused = false
}

_controller.prototype.getDir = function()
{
	return this.dir
}

_controller.prototype.getIsJumping = function()
{
	return this.isJumping
}

_controller.prototype.getIsLifting = function()
{
	return this.isLifting
}

_controller.prototype.getPlayer = function()
{
	return this.player
}

_controller.prototype.setPlayer = function(player)
{
	this.player = player
}

//SO, this might be a real poll, or it might just pretend to be polling
_controller.prototype.poll = function()
{
	console.error("Polling not implemented")
}

var keyPressed = {}


window.addEventListener("keydown", function(e)
{
	keyPressed[e.keyCode] = true
}, true)
window.addEventListener("keyup", function(e)
{
	keyPressed[e.keyCode] = false
}, true)





/** 
(		The Following methosd should not be called by external code
(*/

_controller.prototype.setDir2 = function(x,y)
{
	if (this.dir.x != x || this.dir.y != y)
	{
		this.dir.x = x
		this.dir.y = y
		if (this.event_listeners[this.DIRECTION_EVENT])
			for (var i = 0; i < this.event_listeners[this.DIRECTION_EVENT].length; i++)
				this.event_listeners[this.DIRECTION_EVENT][i](this)
	}
}

_controller.prototype.setDir = function(left,right,up,down)
{
	var x = 0;
	var y = 0;
	x += left ? -1 : 0;
	x += right ? 1 : 0;
	y += up ? 1 : 0;
	y += down ? -1 : 0;

	this.setDir2(x,y);

}

_controller.prototype.setJump = function(jump)
{
	if (this.isJumping == jump)
		return
	this.isJumping = jump
	if (jump)
		{
			if (this.event_listeners[this.JUMP_PRESS_EVENT])
				for (var i = 0; i < this.event_listeners[this.JUMP_PRESS_EVENT].length; i++)
					this.event_listeners[this.JUMP_PRESS_EVENT][i](this)
		}
	else
		{
			if (this.event_listeners[this.JUMP_RELEASE_EVENT])
				for (var i = 0; i < this.event_listeners[this.JUMP_RELEASE_EVENT].length; i++)
					this.event_listeners[this.JUMP_RELEASE_EVENT][i](this)
		}
}

_controller.prototype.setLift = function(lift)
{
	if (this.isLifting == lift)
		return
	this.isLifting = lift
	if (lift)
	{
		if (this.event_listeners[this.LIFT_PRESS_EVENT])
			for (var i = 0; i < this.event_listeners[this.LIFT_PRESS_EVENT].length; i++)
			this.event_listeners[this.LIFT_PRESS_EVENT][i](this)
	}
	else
	{
		if (this.event_listeners[this.LIFT_RELEASE_EVENT])
			for (var i = 0; i < this.event_listeners[this.LIFT_RELEASE_EVENT]; i++)
			this.event_listeners[this.LIFT_RELEASE_EVENT][i](this)
	}
}




keyboard_controller.prototype = new _controller()

keyboard_controller.prototype.poll = function()
{
	var b = this.bindings
	var up = keyPressed[b.up]
	var down = keyPressed[b.down]
	var left = keyPressed[b.left]
	var right = keyPressed[b.right]
	var jump = keyPressed[b.jump]
	var lift= keyPressed[b.hold]

	this.setDir(left,right,up,down)
	this.setJump(jump)
	this.setLift(lift)
}

gamepad_controller.prototype = new _controller();

gamepad_controller.prototype.poll = function()
{

	var controller = navigator.webkitGetGamepads()[this.controllerIndex]
	var pressed = function(button)
	{
		return controller.buttons[button] && (controller.buttons[button] > .3)
	}
	var b = this.bindings
	var up = pressed(b.up)
	var down = pressed(b.down)
	var left = pressed(b.left)
	var right = pressed(b.right)
	var jump = pressed(b.jump)
	var lift = pressed(b.lift)

	this.setDir(left,right,up,down)
	this.setJump(jump)
	this.setLift(lift)
}