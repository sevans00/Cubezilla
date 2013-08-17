#pragma strict

var game : Game;

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.color = Color (1, 1, 1, .2);
	var buildingScale : Vector3 = transform.localScale;
	buildingScale.y *= 2;
	buildingScale.x *= 0.5;
	buildingScale.z *= 0.5;
	Gizmos.DrawCube(transform.position, buildingScale);
}


//Health of the building:
var health : float = 100;


function Start () {
	//DoDeath();
	game = GameObject.Find("Game").GetComponent(Game);
}




//Building got damaged!
function Damage ( amount : float ) {
	health -= amount;
	if ( health <= 0 ) {
		DoDeath();
	} else {
		PlayDamageAnimation();
	}
}

//Perform the death:
var building_Destroy_Cloud_Prefab : GameObject;
function DoDeath() {
	//Add some fancy graphical effects here
	Instantiate(building_Destroy_Cloud_Prefab, transform.position, transform.rotation);
	//Free Up my space in CityGrid:
	GameObject.Find("CityGrid").GetComponent(CityGrid).freeWorldSpace(transform.position);
	Destroy(gameObject);
	game.incrementKillBy(10);
}

//Play damaged animation
function PlayDamageAnimation() : void {
	
}
