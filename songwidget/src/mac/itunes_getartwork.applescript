try
	set imgPOSIXPath to (POSIX path of the (path to "temp" from user domain)) & "cacheArtwork"
	set imgPath to POSIX file imgPOSIXPath as string
	set pictPath to imgPath & ".pict"
	
	tell application "iTunes"
		set theImage to front artwork of the current track
		set theFormat to the format of theImage as string
		if (theFormat contains "JPEG") then
			set extension to ".jpg"
		else if (theFormat contains "PNG") then
			set extension to ".png"
		else -- no artwork
			return ""
		end if
		set theData to the data of theImage as picture
	end tell
	
	set theFile to open for access file pictPath with write permission
	write theData to theFile
	close access theFile
	-- Chop off the first 223 bytes, idea from http://forums.macosxhints.com/archive/index.php/t-30910.html
	do shell script "tail -c +223 " & imgPOSIXPath & ".pict > " & imgPOSIXPath & extension
	
	return imgPOSIXPath & extension
on error
	return ""
end try