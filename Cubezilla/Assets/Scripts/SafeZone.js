#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.color = Color (1, 1, 0, .2);
	var safeZoneScale : Vector3 = transform.localScale;
	safeZoneScale.y *= 1;
	safeZoneScale.x *= 1;
	safeZoneScale.z *= 1;
	Gizmos.DrawCube(transform.position + Vector3.forward/2 + Vector3.right/2 + Vector3.up/2, safeZoneScale);
}
/*
var godzillaBlocking : boolean = false;
function OnTriggerEnter(other : Collider) {
	Debug.Log("Other=" + other.gameObject);
	if ( other.gameObject.name == "Godzilla" ) {
		godzillaBlocking = true;
	}
	if ( !godzillaBlocking && other.gameObject.name == "NPC") {
		Debug.Log("Rescue this NPC!");
	}
}
function OnTriggerExit(other : Collider) {
	Debug.Log("Other=" + other.gameObject);
	if ( other.name == "Godzilla" ) {
		godzillaBlocking = false;
	}
}
*/