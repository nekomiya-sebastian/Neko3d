class Button extends Hitbox
{
	constructor( x,y,width,height )
	{
		super( x,y,width,height )
		
		this.hovering = false
		this.down = false
		this.pressed = false
	}
	
	Update( mouse,nekoCam )
	{
		this.pressed = false
		
		this.down = mouse.down
		if( mouse.down )
		{
			if( this.hovering || mouse.usingTouch ) this.pressed = true
			
			this.hovering = false
		}
		else
		{
			const mouseWorldPos = nekoCam.GetMouseWorldPos( mouse )
			this.hovering = this.Contains( mouseWorldPos.x,mouseWorldPos.y )
		}
		
		return( this.Pressed() )
	}
	
	Draw( nekoCam,regularColor = "green",highlightColor = "lime" )
	{
		const drawCol = this.hovering ? highlightColor : regularColor
		super.Draw( nekoCam,drawCol )
	}
	
	Pressed()
	{
		return( this.pressed )
	}
}