#pragma strict


var walkSpeed : float = 1f;
var runSpeed : float = 3f;
private var viewRadius : float = 5f;
private var runRadius : float = 1f;
private var safeRadius : float = 2f;
var onFireTime : float = 3.0f;
var speedDeviation : float = 0.5f;
var maxRandTurn : float = 5.0f;

private var cityGrid : CityGrid;
private var godzilla : Transform;
private var game : Game;
var path : Array = new Array();
var safezone : GameObject;
var safezones : GameObject[];
var fleeing : boolean = false;
var screamVolume : float;
var screamSounds : AudioClip[];

private var flames : ParticleSystem;

// testing values
var testPoint = Vector3(20, 0.5, 20);
var points = new Array(testPoint, Vector3(30, 0.5, 40));

function Start () {
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
	var zilla: GameObject = GameObject.Find("Godzilla");
	godzilla = zilla.transform;
	game = GameObject.Find("Game").GetComponent(Game);
	
	flames = GetComponentInChildren(ParticleSystem);

	//safezone = GameObject.Find("SafeZone");
	safezones = GameObject.FindGameObjectsWithTag("SafeZone");
	findNearestSafeZone();
	//Debug.Log("safezone info: " + safezone.transform.position);
	
	transform.position.y = 0.06;

	speedDeviation = Mathf.Clamp01(speedDeviation);
	var deviation = Random.Range(1-speedDeviation, speedDeviation+1);
	walkSpeed *= deviation;
	runSpeed *= deviation;
	
	
}

function Update () {
	transform.position.y = 0.06;
	
	var distToEnemy = Vector3.Distance(transform.position, godzilla.position);
	if (distToEnemy < runRadius) {
		fleeing = false;
		RunFromEnemy();
	} else if ((distToEnemy < safeRadius) || fleeing) {
		RunToSafeZone();
		fleeing = true;
	} else {
		fleeing = false;
		RandomWalk();
	}
	
}

function setToFlee(){
	fleeing = true;
}

function OnTriggerEnter(other : Collider) {
	if (other.name == "Godzilla") {
		Kill();
	} else if (other.name == "FireBreath") {
		OnFire();
	} else if (other.name == "SafeZone") {
		Escape();
	}
}

function Move( speed : float ) {
	//Non physics method:
	//*
	var current_GridPoint : Vector2 = cityGrid.worldPointToGridPoint(transform.position);
	var distance : float = speed * Time.deltaTime * 2 + transform.localScale.z;
	var next_GridPoint : Vector2 = cityGrid.worldPointToGridPoint(transform.position + transform.forward * distance);
	if ( current_GridPoint != next_GridPoint && !cityGrid.isGridPointAvailable(next_GridPoint) ) {
		//Need to turn:
		var direction : Vector3 = transform.forward;
		var normal : Vector3 = new Vector3(next_GridPoint.x - current_GridPoint.x, 0, next_GridPoint.y - current_GridPoint.y);
		direction = Vector3.Reflect(direction, normal);
		direction.y = 0;
		direction.Normalize();
		Debug.DrawLine(transform.position, transform.position + direction, Color.red, 1);
		Debug.DrawLine(transform.position, transform.position + transform.forward, Color.red, 1);
		RotateToDirection(direction);
	}
	
	/*/
	//Physics method:
	var hit : RaycastHit;
	var p1 : Vector3 = myTransform.position;
	var p2 : Vector3 = p1 + myTransform.forward * speed * Time.deltaTime * 2;
	var distance : float = Vector3.Distance(p1, p2);
	
    if ( Physics.SphereCast(p1, myTransform.localScale.z, myTransform.forward, hit, distance)) {
    	var direction : Vector3 = transform.forward;
		direction = Vector3.Reflect(direction, hit.normal);
		
		direction.y = 0;
		direction.Normalize();
		
		RotateToDirection(direction);
    }
	//*/
	transform.position += transform.forward * speed * Time.deltaTime;
	//GetComponent(CharacterController).Move(myTransform.forward * speed * Time.deltaTime);
}

function moveTo (point : Vector3) {
		point.y = transform.position.y;
		var distance : float = Vector3.Distance (transform.position, point);
		transform.LookAt (point);
		if (distance > 0.1) {
			transform.position += transform.forward * Time.deltaTime * runSpeed;
		}
	}

//Rotate to a direction:
function RotateToDirection(direction : Vector3) {
	var dir_vec2 : Vector2 = new Vector2(direction.x, direction.z);
	var forward_vec2 : Vector2 = new Vector2(transform.forward.x, transform.forward.z);
	var angle : float = Vector2.Angle(forward_vec2, dir_vec2);
	
	var cross : float = Vector3.Cross(direction, transform.forward).y;
	var sign : int = cross < 0 ? 1 : -1;
	
	transform.Rotate(0, sign * angle, 0);
}

function RandomWalk() {
	var randTurn = Random.Range(-maxRandTurn, maxRandTurn);
	transform.Rotate(0, randTurn, 0);
	Move(walkSpeed);
}

function RunToPoint(newPos : Vector3) {
	RotateToDirection( newPos );
	Move(runSpeed);
}

function RunFromEnemy() {
	var dirToRun : Vector3 = transform.position - godzilla.position;
	dirToRun.y = 0;
	RunToPoint(dirToRun);
}

function RunToSafeZone() {
	if(safezone){
		//Debug.Log("safezone exists");
		startMovement(safezone.transform.position);
	}else{
		RunFromEnemy();
	}
}

function OnFire() {
	flames.Play();
	var num : int = Random.Range(0, screamSounds.Length-1);
	Camera.main.audio.PlayOneShot(screamSounds[num], screamVolume);
	yield WaitForSeconds(onFireTime);
	Kill();
}

function Kill() {
	if (game != null)
		game.incrementKillBy(1);
	Destroy(gameObject);
}

function Escape() {
	if (game != null)
		game.civilianEscaped(1);
	Destroy(gameObject);
}

function findNearestSafeZone(){
	var nearest : float = 100;
	var safezoneLoc : Vector3;
	for(var i = 0; i < safezones.Length; ++i){
		var distance : float = Vector3.Distance(transform.position, safezones[i].transform.position);
		if( distance < nearest ){
			nearest = distance;
			safezone = safezones[i];
			safezoneLoc = safezones[i].transform.position;
		}
	}
	//var safezoneLoc : Vector3 = safezone.transform.position;
	//Debug.Log("safezone: " + safezoneLoc);
	//startMovement(safezoneLoc);
}

function startMovement(toPosition : Vector3){
		if(path.length > 0){
			//Debug.Log("path exists");
			followPath(path);
		}else{
			//Debug.Log("path does not exist");
			path = cityGrid.getWorldPath(transform.position, toPosition);
			followPath(path);
		}
	}
	
function followPath(path : Array){
		if (path.length > 0){
			var distance : float = Vector3.Distance (transform.position, path[0]);
			if(distance < 0.2){
				//Debug.Log("At point");
				path.RemoveAt(0);
			}else{
				//Debug.Log("Move to point");
				moveTo(path[0]);
			}
		}
	}

function SetColor(num : float) {
	
	
	gameObject.renderer.material.color = Color.Lerp(Color.white, Color.red, num);

}
	
function panic(num : float) {
	if (num > 1)
		num = Mathf.Clamp01(num);
	SetColor(num);
	SetSpeed(num);
}

function SetSpeed(num : float) {
	walkSpeed = Mathf.Lerp(0.15, 0.8, num);
	runSpeed = Mathf.Lerp(0.8, 1.5, num);
}