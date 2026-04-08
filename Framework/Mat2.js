class Mat2
{
	// [ a b ]
	// [ c d ]
	constructor( a,b,c,d )
	{
		this.a = a
		this.b = b
		this.c = c
		this.d = d
	}
	
	Apply( vec2 )
	{
		const newVec = vec2.Copy()
		newVec.x = this.a * vec2.x + this.c * vec2.y
		newVec.y = this.b * vec2.x + this.d * vec2.y
		return( newVec )
	}
}

Mat2.GetRotMat = function( angle )
{
	const c = Math.cos( angle )
	const s = Math.sin( angle )
	return( new Mat2( c,s,-s,c ) )
}