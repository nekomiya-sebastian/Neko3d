class Mat3
{
	// [ a b c ]
	// [ d e f ]
	// [ g h i ]
	constructor( a,b,c,d,e,f,g,h,i )
	{
		this.a = a
		this.b = b
		this.c = c
		this.d = d
		this.e = e
		this.f = f
		this.g = g
		this.h = h
		this.i = i
	}
	
	Apply( vec3,modify = false )
	{
		const newVec = vec3.Copy()
		
		newVec.x = this.a * vec3.x + this.d * vec3.y + this.g * vec3.z
		newVec.y = this.b * vec3.x + this.e * vec3.y + this.h * vec3.z
		newVec.z = this.c * vec3.x + this.f * vec3.y + this.i * vec3.z
		
		if( modify ) vec3.Set( newVec )
		
		return( newVec )
	}
	
	MatMult( other )
	{
		const newMat = new Mat3(
			this.a * other.a + this.b * other.d + this.c * other.g,
			this.a * other.b + this.b * other.e + this.c * other.h,
			this.a * other.c + this.b * other.f + this.c * other.i,
			
			this.d * other.a + this.e * other.d + this.f * other.g,
			this.d * other.b + this.e * other.e + this.f * other.h,
			this.d * other.c + this.e * other.f + this.f * other.i,
			
			this.g * other.a + this.h * other.d + this.i * other.g,
			this.g * other.b + this.h * other.e + this.i * other.h,
			this.g * other.c + this.h * other.f + this.i * other.i
		)
		
		return( newMat )
	}
}

Mat3.Identity = function()
{
	return( new Mat3(
		1,0,0,
		0,1,0,
		0,0,1 ) )
}

Mat3.GetXRotMat = function( angle )
{
	const c = Math.cos( angle )
	const s = Math.sin( angle )
	return( new Mat3(
		1,0,0,
		0,c,-s,
		0,s,c ) )
}
Mat3.GetYRotMat = function( angle )
{
	const c = Math.cos( angle )
	const s = Math.sin( angle )
	return( new Mat3(
		c,0,s,
		0,1,0,
		-s,0,c ) )
}
Mat3.GetZRotMat = function( angle )
{
	const c = Math.cos( angle )
	const s = Math.sin( angle )
	return( new Mat3(
		c,-s,0,
		s,c,0,
		0,0,1
		) )
}