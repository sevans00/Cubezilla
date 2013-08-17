#pragma strict


var cityGrid : CityGrid;
var aStarPath : Array = new Array();
var goalObject : GameObject;
var previousGoalObject_gridPoint : Vector2;

function Start () {
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
	previousGoalObject_gridPoint = cityGrid.nullVector2();
}

function FixedUpdate () {
	//Set the goal gridpoint
	if ( previousGoalObject_gridPoint == cityGrid.nullVector2() ) {
		previousGoalObject_gridPoint = cityGrid.worldPointToGridPoint(goalObject.transform.position);
		aStarPath = cityGrid.getWorldPath(transform.position, goalObject.transform.position);
		Debug.Log("A Star Path:" + aStarPath);
	} else {
		//Check if needed to recalculate:
		if ( previousGoalObject_gridPoint != cityGrid.worldPointToGridPoint(goalObject.transform.position) ) {
			previousGoalObject_gridPoint = cityGrid.worldPointToGridPoint(goalObject.transform.position);
			aStarPath = cityGrid.getWorldPath(transform.position, goalObject.transform.position);
			Debug.Log("A Star Path:" + aStarPath);
		} else {
			if ( aStarPath.length != 0 ) {
				var prevPoint : Vector3 = aStarPath[0];
				var currentPoint : Vector3;
				for ( var ii : int = 1; ii < aStarPath.length; ii++ ) {
					currentPoint = aStarPath[ii];
					Debug.DrawLine(prevPoint,currentPoint, Color.red);
					prevPoint = aStarPath[ii];
				}
			} else {
				Debug.Log("No Path Found");
			}
		}
	}
	/*
	var gridPoint : Vector2 = cityGrid.worldPointToGridPoint(transform.position);
	var worldPoint : Vector3 = cityGrid.gridPointToWorldPoint(gridPoint);
	Debug.Log("TransformPoint:" + transform.position + "GridPoint:" + cityGrid.worldPointToGridPoint(transform.position) + " WorldPoint:" + worldPoint);
	*/
	
}
