#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.color = Color (0, 0, 1, .2);
	Gizmos.DrawCube(transform.position, transform.localScale);
}
