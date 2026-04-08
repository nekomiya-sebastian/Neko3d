class Hitbox
{
	constructor( x,y,width,height,centered = false )
	{
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.centered = centered
	}
	
	Draw( nekoCam,col = "#FF00FF" )
	{
		nekoCam.DrawRect( new Vec2( this.x,this.y ),this.width,this.height,col )
	}
	
	MoveTo( x,y,centered = true )
	{
		this.x = x - ( centered ? this.width / 2 : 0 )
		this.y = y - ( centered ? this.height / 2 : 0 )
	}
	
	MoveBy( x,y )
	{
		this.x += x
		this.y += y
	}
	
	Contains( x,y )
	{
		if( this.centered )
		{
			x += this.width / 2
			y += this.height / 2
		}
		return( x > this.x && x < this.x + this.width &&
			y > this.y && y < this.y + this.height )
	}
	
	Overlaps( otherHitbox )
	{
		const x = this.x - ( this.centered ? this.width / 2 : 0 )
		const y = this.y - ( this.centered ? this.height / 2 : 0 )
		const otherX = otherHitbox.x - ( otherHitbox.centered ? otherHitbox.width / 2 : 0 )
		const otherY = otherHitbox.y - ( otherHitbox.centered ? otherHitbox.height / 2 : 0 )
		
		return( x + this.width > otherX && x < otherX + otherHitbox.width &&
			y + this.height > otherY && y < otherY + otherHitbox.height )
	}
	
	GetSize()
	{
		return( new Vec2( this.width,this.height ) )
	}
}