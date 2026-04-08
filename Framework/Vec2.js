class Vec2
{
	constructor( x,y )
	{
		this.x = x
		this.y = y
	}
	
	Add( other )
	{
		this.x += other.x
		this.y += other.y
		
		return( this )
	}
	
	Subtract( other )
	{
		this.x -= other.x
		this.y -= other.y
		
		return( this )
	}
	
	Scale( amount )
	{
		this.x *= amount
		this.y *= amount
		
		return( this )
	}
	
	MultiplyVec( otherVec )
	{
		this.x *= otherVec.x
		this.y *= otherVec.y
		
		return( this )
	}
	
	Divide( amount )
	{
		this.x /= amount
		this.y /= amount
		
		return( this )
	}
	
	DivideVec( otherVec )
	{
		this.x /= otherVec.x
		this.y /= otherVec.y
		
		return( this )
	}
	
	Floorify()
	{
		this.x = Math.floor( this.x )
		this.y = Math.floor( this.y )
		
		return( this )
	}
	Ceilify()
	{
		this.x = Math.ceil( this.x )
		this.y = Math.ceil( this.y )
		
		return( this )
	}
	
	Set( other )
	{
		this.SetXY( other.x,other.y )
	}
	SetXY( x,y )
	{
		this.x = x
		this.y = y
	}
	
	Copy()
	{
		return( new Vec2( this.x,this.y ) )
	}
	
	GetDistSq()
	{
		return( this.x * this.x + this.y * this.y )
	}
	
	GetDist()
	{
		return( Math.sqrt( this.GetDistSq() ) )
	}
	
	Normalize()
	{
		const len = this.GetDist()
		if( len != 0 )
		{
			this.Divide( len )
		}
		
		return( this )
	}
	
	Equals( other )
	{
		return( this.x == other.x && this.y == other.y )
	}
	
	X()
	{
		return( new Vec2( this.x,0 ) )
	}
	
	Y()
	{
		return( new Vec2( 0,this.y ) )
	}
	
	IsVertical()
	{
		return( this.x == 0 && this.y != 0 )
	}
}

Vec2.Zero = function()
{
	return( new Vec2( 0,0 ) )
}
Vec2.One = function()
{
	return( new Vec2( 1,1 ) )
}

Vec2.Up = function()
{
	return( new Vec2( 0,-1 ) )
}
Vec2.Down = function()
{
	return( new Vec2( 0,1 ) )
}
Vec2.Left = function()
{
	return( new Vec2( -1,0 ) )
}
Vec2.Right = function()
{
	return( new Vec2( 1,0 ) )
}

Vec2.Cardinals = function()
{
	return( [ Vec2.Up(),Vec2.Down(),Vec2.Left(),Vec2.Right() ] )
}
Vec2.Ordinals = function()
{
	return( [ new Vec2( -1,-1 ),new Vec2( 1,-1 ),new Vec2( -1,1 ),new Vec2( 1,1 ) ] )
}