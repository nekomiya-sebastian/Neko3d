class Keyboard
{
	constructor( gfx )
	{
		this.keys = []
		
		const canv = gfx.canvas
		const self = this
		
		onkeydown = function( e )
		{
			self.keys[e.keyCode] = true
		}
		
		onkeyup = function( e )
		{
			self.keys[e.keyCode] = false
		}
	}
	
	IsKeyDown( key )
	{
		return( this.keys[key.charCodeAt( 0 )] === true )
	}
	IsKeycodeDown( keyCode )
	{
		return( this.keys[keyCode] === true )
	}
}

class Key {}
Key.Backspace = 8
Key.Left = 37
Key.Right = 39