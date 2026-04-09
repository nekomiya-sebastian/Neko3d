class NekoModel
{
	constructor( shape,faces,colors,
		pos = Vec3.Zero(),rot = Vec3.Zero(),scale = 1 )
	{
		this.shape = shape
		this.faces = faces
		this.colors = colors
		NekoUtils.Assert( this.faces.length == this.colors.length,
			"Mismatching face count and colors list length!" )
		
		this.trans = new Transneko( pos,rot,scale )
	}
	
	GetPos()
	{
		return( this.trans.GetPos() )
	}
	GetRot()
	{
		return( this.trans.GetRot() )
	}
	GetScale()
	{
		return( this.trans.GetScale() )
	}
	SetScale( scale )
	{
		this.trans.SetScale( scale )
	}
	
	GenTransPoints( neko3dCam )
	{
		if( this.trans.invalidatePoints )
		{
			// init trans points based on self
			this.transPoints = this.trans.GetTransPointsList( this.shape )
			// then cam transform
			for( const point of this.transPoints ) neko3dCam.TransPoint( point )
			
			this.trans.invalidatePoints = false
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
		let ind = this.ind
		const nColors = this.modelRef.colors.length
		while( ind >= nColors ) ind -= nColors
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
	
	return( new NekoModel( shape,faces,colors ) )
}