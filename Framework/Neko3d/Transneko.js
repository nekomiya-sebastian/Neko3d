class Transneko
{
	constructor( pos = Vec3.Zero(),rot = Vec3.Zero(),scale = 1 )
	{
		this.pos = pos
		this.rot = rot
		this.rotMat = Mat3.Identity()
		this.scale = scale
		
		// these 2 used not by self, but by NekoModel
		this.invalidatePoints = true
		this.invalidateRot = true
		this.invalidateNorms = true
	}
	
	GetTransPointsList( shape )
	{
		const transPoints = []
		
		if( this.invalidateRot )
		{
			this.rotMat = this.GetRotMat()
			this.invalidateRot = false
		}
		
		for( const i in shape )
		{
			const point = shape[i].Copy()
			transPoints.push( point )
			
			this.TransPoint( point )
		}
		
		return( transPoints )
	}
	// Trying this instead of GetTransPointsList so we can reduce memory footprint maybe
	FillTransPointsList( shape,list )
	{
		// fill initial list if empty
		if( list.length < shape.length )
		{
			const points = this.GetTransPointsList( shape )
			for( const point of points ) list.push( point )
			return( list )
		}
		
		// transform list elements without creating new ones
		for( let i = 0; i < shape.length; ++i )
		{
			list[i].Set( shape[i] )
			this.TransPoint( list[i] )
		}
		
		return( list )
	}
	
	TransPoint( point )
	{
		if( this.invalidateRot )
		{
			this.rotMat = this.GetRotMat()
			this.invalidateRot = false
		}
		
		// scale
		point.Scale( this.scale )
		
		// then rotate
		this.rotMat.Apply( point,true )
		
		// finally translate
		point.Add( this.pos )
		
		return( point )
	}
	
	InvalidatePoints()
	{
		this.invalidatePoints = true
	}
	InvalidateRot()
	{
		this.invalidateRot = true
		this.invalidateNorms = true
	}
	
	GetPos()
	{
		this.invalidatePoints = true
		return( this.pos )
	}
	GetPosCopy() // so we can read without invalidating
	{
		return( this.pos.Copy() )
	}
	GetRot()
	{
		this.invalidatePoints = true
		this.invalidateRot = true
		this.invalidateNorms = true
		return( this.rot )
	}
	GetRotCopy()
	{
		return( this.rot.Copy() )
	}
	GetScale()
	{
		return( this.scale )
	}
	SetScale( scale )
	{
		this.invalidatePoints = true
		this.scale = scale
	}
	
	GetRotMat()
	{
		if( this.invalidateRot ) this.CalcRotMat()
		return( this.rotMat )
	}
	CalcRotMat()
	{
		this.rotMat = Mat3.GetXRotMat( this.rot.x )
			.MatMult( Mat3.GetYRotMat( -this.rot.y ) )
			.MatMult( Mat3.GetZRotMat( this.rot.z ) )
	}
	
	CalcForward()
	{
		return( this.GetRotMat().Apply( Vec3.Forward() ) )
	}
}