#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.DrawIcon(transform.position, "Input.png");
}

/**
 * INPUT OBJECT
 * 
 * ALL INPUT SHOULD GO THROUGH HERE
 * 
 * Also GUI CODE SHOULD GO HERE
 */

var godzilla : Godzilla;
var cityGrid : CityGrid;

//Mobile variables (to do some fancy stuff)
var mobile : boolean = true;
var mobile_jumpSelected : boolean = false;

function Start () {
	godzilla = GameObject.Find("Godzilla").GetComponent(Godzilla);
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
}

//Update:
function FixedUpdate () {
	ControlGodzilla();
	MoveCamera();
}
//GUI:
var guiButtonSkin : GUISkin;
function OnGUI () {
	if ( mobile ) {
		GUI.skin = guiButtonSkin;
		
		var btnHeight : float = 50;
		var btnWidth : float  = 100;
		var jumpBtn_Rect : Rect  = new Rect( 10, Screen.height - btnHeight - 10, 		btnWidth, btnHeight );
		var flameBtn_Rect : Rect = new Rect( 10, Screen.height - btnHeight*2 - 20, 	btnWidth, btnHeight );
		
		var guiButton_NormalTexture : Texture2D = GUI.skin.button.normal.background;
		var guiButton_ActiveTexture : Texture2D = GUI.skin.button.active.background;
		if ( mobile_jumpSelected ) {
			GUI.skin.button.normal.background = guiButton_ActiveTexture;
			GUI.skin.button.active.background = guiButton_NormalTexture;
			if (GUI.Button (jumpBtn_Rect, "JUMP") ) {
				mobile_jumpSelected = false;
			}
			GUI.skin.button.normal.background = guiButton_NormalTexture;
			GUI.skin.button.active.background = guiButton_ActiveTexture;
		} else {
			if (GUI.Button (jumpBtn_Rect, "JUMP") ) {
				mobile_jumpSelected = true;
			}
		}
		if ( GUI.Button(flameBtn_Rect, "FLAME") ) {
			if (godzilla.canFlame) {
				godzilla.StartFlame();
			}
		}
	}
}












//Perform Fire1 Actions:
var lastClickTime : float = 0;
private var doubleClickTimeOut : float = 0.2;
function ControlGodzilla() : void {
	var screenPosition : Vector2;
	var worldPosition : Vector3;
	var hit : RaycastHit;
	var ray : Ray;
	if (Input.GetButtonDown ("Fire1") && Input.mousePosition != null) {
		//Get the mouse position:
		screenPosition = Input.mousePosition;
		//And the world position:
		ray = Camera.main.ScreenPointToRay (screenPosition);
		if (Physics.Raycast (ray, hit, 100)) {
			worldPosition = hit.point;
			hit.point.y = 0;
			
			if ( mobile ) {
				if ( mobile_jumpSelected ) {
					mobile_jumpSelected = false;
					godzilla.JumpToPoint(worldPosition);
				} else {
					//Is this a double-click?
					if ( lastClickTime + doubleClickTimeOut >= Time.time && godzilla.canJump) {
						Debug.Log("Do double click!");
						//Do Double Click:
						godzilla.JumpToPoint(worldPosition);
					} else {
						Debug.Log("Do single click!");
						//Do Single Click:
						godzilla.MoveToPoint(worldPosition);
					}
				}
			} else {			
				//Is this a double-click?
				if ( lastClickTime + doubleClickTimeOut >= Time.time && godzilla.canJump) {
					Debug.Log("Do double click!");
					//Do Double Click:
					godzilla.JumpToPoint(worldPosition);
				} else {
					Debug.Log("Do single click!");
					//Do Single Click:
					godzilla.MoveToPoint(worldPosition);
				}
			}
		}
	} else {
		if ( Input.mousePosition != null ) {
			//Get the mouse position:
			screenPosition = Input.mousePosition;
			//And the world position:
			ray = Camera.main.ScreenPointToRay (screenPosition);
			if (Physics.Raycast (ray, hit, 100)) {
				worldPosition = hit.point;
				godzilla.LookAtPoint(hit.point);
			}
		}
		
	}
	if ( Input.GetButtonUp("Fire1") ) {
		lastClickTime = Time.time;
	}
	
	if ( Input.GetKey("space") ) {
		if (godzilla.canFlame) {
			godzilla.StartFlame();
		}
	}
	
	//ShowGodzillaInGameGUI();
}
//if helicopter engage!

//scary flames
/**
 * Show the Godzilla GUI
 */
private var inGameGui_JumpOverlaySquares : Array = new Array();
private var inGameGui_JumpOverlaySquares_hidden : boolean = true;
private var inGameGui_JumpWorldPoints : Array = new Array();
var overlayPanePrefab : GameObject;
private var inGameGui_OverlayHeight : float = 1.5;
function ShowGodzillaInGameGUI () : void {
	return;
	if ( overlayPanePrefab == null ) {
		return;
	}
	if ( mobile_jumpSelected ) {
		var ii : int;
		var square : GameObject;
		inGameGui_JumpWorldPoints = cityGrid.getJumpWorldPoints(godzilla.transform.position, godzilla.jump_distance, godzilla.allowBuildingJumping);
		//Do we have all the jumpsquares? - instead of recreating each time, create just once and store:
		while ( inGameGui_JumpOverlaySquares.length < inGameGui_JumpWorldPoints.length ) { //Create them:
			square = Instantiate(overlayPanePrefab, Vector3.zero, Quaternion.identity);
			square.transform.Rotate(-90,0,0);
			square.renderer.material.color = Color.red;
			square.renderer.material.color.a = 0.5;
			inGameGui_JumpOverlaySquares.Push( square );
		}
		//Place them in the proper locations:
		for (ii = 0; ii < inGameGui_JumpWorldPoints.length; ii++ ) { //Place them:
			square = inGameGui_JumpOverlaySquares[ii];
			square.transform.position = inGameGui_JumpWorldPoints[ii];
			square.transform.position.y = inGameGui_OverlayHeight;
			square.active = true;
		}
		inGameGui_JumpOverlaySquares_hidden = false; //We're showing the squares now
	} else {
		if ( !inGameGui_JumpOverlaySquares_hidden ) {
			for (ii = 0; ii < inGameGui_JumpWorldPoints.length; ii++ ) { //Place them:
				square = inGameGui_JumpOverlaySquares[ii];
				square.active = false;
			}
			inGameGui_JumpOverlaySquares_hidden = true;
		}
	}
}








//Move the Camera:
function MoveCamera() : void {
	//Zoom In:
	var scrollWheelDelta : float = Input.GetAxis("Mouse ScrollWheel");
	var scrollWheelSpeed : float = 2.0;
	Camera.main.gameObject.transform.position.y += scrollWheelDelta * scrollWheelSpeed;
	
	//Move:
	var cameraMoveSpeed : float = Camera.main.gameObject.transform.position.y / 20;
	var horizontalDelta : float = Input.GetAxis("Horizontal");
	Camera.main.gameObject.transform.position.x += horizontalDelta * cameraMoveSpeed;
	var verticalDelta : float = Input.GetAxis("Vertical");
	Camera.main.gameObject.transform.position.z += verticalDelta * cameraMoveSpeed;
	//Keep Camera Inside World:
	if (Camera.main.gameObject.transform.position.x > cityGrid.world_maxX ) {
		Camera.main.gameObject.transform.position.x = cityGrid.world_maxX;
	}
	if (Camera.main.gameObject.transform.position.x < cityGrid.world_minX ) {
		Camera.main.gameObject.transform.position.x = cityGrid.world_minX;
	}
	if (Camera.main.gameObject.transform.position.z > cityGrid.world_maxZ ) {
		Camera.main.gameObject.transform.position.z = cityGrid.world_maxZ;
	}
	if (Camera.main.gameObject.transform.position.z < cityGrid.world_minZ ) {
		Camera.main.gameObject.transform.position.z = cityGrid.world_minZ;
	}
}












