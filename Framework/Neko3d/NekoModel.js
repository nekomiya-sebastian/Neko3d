class NekoModel
{
	constructor( shape,faces,colors,
		pos = Vec3.Zero(),rot = Vec3.Zero(),scale = 1 )
	{
		this.shape = shape
		this.faces = faces
		this.colors = colors
		NekoUtils.Assert( this.faces.length == this.colors.length )
		
		this.pos = pos
		this.rot = rot
		this.rotMat = Mat3.Identity()
		this.scale = scale
		
		this.transPoints = []
		this.invalidatePoints = true
		this.invalidateRot = true
	}
	
	GetPos()
	{
		this.invalidatePoints = true
		return( this.pos )
	}
	GetRot()
	{
		this.invalidatePoints = true
		this.invalidateRot = true
		return( this.rot )
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
	
	GenTransPoints()
	{
		if( this.invalidatePoints )
		{
			if( this.invalidateRot )
			{
				this.rotMat = Mat3.GetXRotMat( this.rot.x )
					.MatMult( Mat3.GetYRotMat( -this.rot.y ) )
					.MatMult( Mat3.GetZRotMat( this.rot.z ) )
			}
			
			this.transPoints.length = 0
			for( const i in this.shape )
			{
				const point = this.shape[i].Copy()
				this.transPoints.push( point )
				
				// scale
				const boxScale = 1
				point.Scale( this.scale )
				
				// then rotate
				this.rotMat.Apply( point,true )
				
				// finally translate
				point.Add( this.pos )
			}
		}
		return( this.transPoints )
	}
	
	GetTransPoint( ind )
	{
		NekoUtils.Assert( ind > -1 && ind < this.shape.length )
		return( this.transPoints[ind] )
	}
	
	GetFaces()
	{
		const faces = []
		for( const i in this.faces )
		{
			faces.push( new NekoModelFace( this.faces[i],this,i ) )
		}
		return( faces )
	}
}

class NekoModelFace
{
	// faceData is [ a,b,c,etc ] list of face indices
	// modelRef is ref to model... dugh
	// ind is what ind into our model we are, to use to get color
	constructor( faceData,modelRef,ind )
	{
		this.faceData = faceData
		this.modelRef = modelRef
		this.ind = ind
	}
	
	GetColor()
	{
		return( this.modelRef.colors[this.ind] )
	}
}

NekoModel.GenCube = function( w = 0.5,h = 0.5,d = 0.5,colors = [] )
{
	const shape = [
		new Vec3( w,-h,-d ), // bot back right
		new Vec3( -w,-h,-d ), // bot back left
		new Vec3( w,h,-d ), // top back right
		new Vec3( -w,h,-d ), // top back left
		
		new Vec3( w,-h,d ), // bot front right
		new Vec3( -w,-h,d ), // bot front left
		new Vec3( w,h,d ), // top front right
		new Vec3( -w,h,d ) // top front left
	]
	const faces = [
		[ 0,1,3,2 ], // top
		[ 0,4,6,2 ], // right
		[ 2,3,7,6 ], // back
		[ 4,5,7,6 ], // bot
		[ 1,0,4,5 ], // front
		[ 1,5,7,3 ] // left
	]
	
	// fill color array if empty, or fill it the rest of the way if necessary
	for( let i = colors.length; i < faces.length; ++i ) colors.push( NekoUtils.RandColor() )
	
	return( new NekoModel(
		shape,faces,colors
	) )
}