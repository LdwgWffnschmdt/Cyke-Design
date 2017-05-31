#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Icon=taskbar_dark.ico
#AutoIt3Wrapper_Res_HiDpi=1  ; DAS HIER IST IMPORTANT FÜR EIN CRISPES TRAY ICON!
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****

; http://www.converticon.com/ <-- Gute Seite für HiRes Icons
TraySetIcon(@ScriptDir & "\taskbar_dark.ico",1) ; DAS HIER IST IMPORTANT FÜR EIN CRISPES TRAY ICON!

#include <GUIConstantsEx.au3>
#include <WindowsConstants.au3>
#Region ### START Koda GUI section ### Form=
$Form1 = GUICreate("Form1", 615, 437, 192, 124)
GUISetState(@SW_SHOW)
#EndRegion ### END Koda GUI section ###

While 1
	$nMsg = GUIGetMsg()
	Switch $nMsg
		Case $GUI_EVENT_CLOSE
			Exit

	EndSwitch
WEnd
