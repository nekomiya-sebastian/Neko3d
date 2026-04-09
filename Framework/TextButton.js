class TextButton extends Button
{
	constructor( pos,text,textDrawer )
	{
		const size = textDrawer.CalcTextHitbox( text )
		
		super( pos.x,pos.y,size.x,size.y )
		
		this.text = text
		
		this.hoverShift = new Vec2( 1,1 )
	}
	
	Draw( nekoCam,textDrawer )
	{
		// super.Draw( nekoCam )
		
		const drawPos = new Vec2( this.x,this.y )
		if( this.hovering ) drawPos.Add( this.hoverShift )
		
		textDrawer.DrawText( this.text,drawPos,nekoCam )
	}
}