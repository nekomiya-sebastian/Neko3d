class Circle
{
	constructor( x,y,radius )
	{
		this.x = x
		this.y = y
		this.rad = radius
	}
	
	MoveBy( move )
	{
		this.x += move.x
		this.y += move.y
	}
	
	MoveTo( pos )
	{
		this.x = pos.x
		this.y = pos.y
	}
	
	Contains( x,y )
	{
		const diff = new Vec2( x,y ).Subtract( new Vec2( this.x,this.y ) ).GetDiffSq()
		return( diff < this.rad * this.rad )
	}
	
	GetEdgeTiles()
	{
		const tiles = []
		
		const radSq = Math.pow( this.rad,2 )
		for( let y = this.y - this.rad; y <= this.y + this.rad; ++y )
		{
			for( let x = this.x - this.rad; x <= this.x + this.rad; ++x )
			{
				const dist = new Vec2( x,y ).Subtract( new Vec2( this.x,this.y ) ).GetDistSq()
				if( Math.abs( radSq - dist ) < this.rad ) tiles.push( new Vec2( x,y ) )
			}
		}
		
		return( tiles )
	}
}