class Vec3
{
	constructor( x,y,z )
	{
		this.x = x
		this.y = y
		this.z = z
	}
	
	Add( other )
	{
		this.x += other.x
		this.y += other.y
		this.z += other.z
		return( this )
	}
	Subtract( other )
	{
		this.x -= other.x
		this.y -= other.y
		this.z -= other.z
		return( this )
	}
	Scale( amount )
	{
		this.x *= amount
		this.y *= amount
		this.z *= amount
		return( this )
	}
	Divide( amount )
	{
		this.x /= amount
		this.y /= amount
		this.z /= amount
		return( this )
	}
	
	GetDistSq()
	{
		return( this.x * this.x +
			this.y * this.y +
			this.z * this.z )
	}
	GetDist()
	{
		return( Math.sqrt( this.GetDistSq() ) )
	}
	
	Normalize()
	{
		const len = this.GetDist()
		if( len != 0.0 ) this.Divide( len )
		
		return( this )
	}
	
	Project()
	{
		return( new Vec2( this.x / this.z,this.y / this.z ) )
	}
	
	Set( other )
	{
		this.SetXYZ( other.x,other.y,other.z )
	}
	SetXYZ( x,y,z )
	{
		this.x = x
		this.y = y
		this.z = z
	}
	
	Copy()
	{
		return( new Vec3( this.x,this.y,this.z ) )
	}
	
	Equals( other )
	{
		return( this.x == other.x && this.y == other.y && this.z == other.z )
	}
}

Vec3.Zero = function()
{
	return( new Vec3( 0,0,0 ) )
}
Vec3.One = function()
{
	return( new Vec3( 1,1,1 ) )
}

Vec3.Up = function()
{
	return( new Vec3( 0,1,0 ) )
}
Vec3.Down = function()
{
	return( new Vec3( 0,-1,0 ) )
}
Vec3.Left = function()
{
	return( new Vec3( -1,0,0 ) )
}
Vec3.Right = function()
{
	return( new Vec3( 1,0,0 ) )
}
Vec3.Forward = function()
{
	return( new Vec3( 0,0,1 ) )
}
Vec3.Back = function()
{
	return( new Vec3( 0,0,-1 ) )
}
