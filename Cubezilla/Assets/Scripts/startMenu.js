

var wakeUp : GUIText;
var quickIntro : GUIText;
var quickIntro2 : GUIText;
var quickIntro3 : GUIText;
var credits1: GUIText;
var credits2: GUIText;

function Start () {

}

function Update () {
	if ( Input.GetKeyDown( KeyCode.Escape ) ) {
		Application.Quit();
	}
}

//var guiSkin : GUISkin;
private var MENU : int = 0;
private var CREDITS : int = 1;
private var menu_state : int = MENU;
var guiSkin : GUISkin;
function OnGUI() {
		GUI.skin = guiSkin;
		GUI.skin.label.fontSize = 18;
		GUI.skin.label.alignment = TextAnchor.UpperCenter;
		//GUILayout.Button ("I am a re-Skinned Button");
		var startBtn_width : float = 100;
		var startBtn_height : float = 30;
		var startBtn_Rect : Rect = new Rect((Screen.width / 2) - startBtn_width/2, Screen.height - 150, startBtn_width, startBtn_height);
		if (GUI.Button(startBtn_Rect, "Start")) {
			Application.LoadLevel(1);
    		//LevelLoadFade.FadeAndLoadLevel("GridCity_Big", Color.white, 2.0);
    	}
		
		var prev_final_killed_1 : int = PlayerPrefs.GetInt( "final_killed_1", 0 );
		var prev_final_escaped_1 : int = PlayerPrefs.GetInt( "final_escaped_1", 0 );
		var prev_final_killed_2 : int = PlayerPrefs.GetInt( "final_killed_2", 0 );
		var prev_final_escaped_2 : int = PlayerPrefs.GetInt( "final_escaped_2", 0 );
		var prev_final_killed_3 : int = PlayerPrefs.GetInt( "final_killed_3", 0 );
		var prev_final_escaped_3 : int = PlayerPrefs.GetInt( "final_escaped_3", 0 );
		
		var highscoreLabel_width : float  = 250;
		var highscoreLabel_height : float = 100;
		var highscoreText : String = "HIGHSCORES:\n";
		highscoreText += "KILLED: " + prev_final_killed_1 + " ESCAPED: " + prev_final_escaped_1 + "\n";
		highscoreText += "KILLED: " + prev_final_killed_2 + " ESCAPED: " + prev_final_escaped_2 + "\n";
		highscoreText += "KILLED: " + prev_final_killed_3 + " ESCAPED: " + prev_final_escaped_3;
		
		var highscore_rect : Rect = Rect (	Screen.width - highscoreLabel_width - 10, 
											40,
											highscoreLabel_width, 
											highscoreLabel_height );
		
		GUI.Label( highscore_rect, highscoreText);
		
		
		var creditsLabel_width : float  = 250;
		var creditsLabel_height : float = 300;
		var creditsText : String = "CREDITS:\n";
		creditsText += "Shaun Evans\n";
		creditsText += "Jessica Johnson\n";
		creditsText += "Ian W Fraser\n";
		creditsText += "\nSpecial Thanks To:\nDerek Yip";
		var credits_rect : Rect = Rect (	Screen.width - creditsLabel_width - 10, 
											40 + highscoreLabel_height,
											creditsLabel_width, 
											creditsLabel_height );
		GUI.Label( credits_rect, creditsText);
		
		
		
}