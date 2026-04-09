class Transneko
{
	constructor( pos = Vec3.Zero(),rot = Vec3.Zero(),scale = 1 )
	{
		this.pos = pos
		this.rot = rot
		this.rotMat = Mat3.Identity()
		this.scale = scale
		
		this.transPoints = []
		this.invalidatePoints = true
		this.invalidateRot = true
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
}