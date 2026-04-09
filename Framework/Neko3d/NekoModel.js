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
		this.transPoints = []
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
		for( let i = 0; i < this.faces.length; ++i )
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
	
	// 2d transformed hitbox rect for ui interaction
	GetRect()
	{
		const points = this.GetPoints()
		
		// rect is smallest possible rect containing all points
		const startPoint = this.modelRef.GetTransPoint( this.faceData[0] ).Copy().Project()
		const rect = new Rect( startPoint.y,startPoint.y,startPoint.x,startPoint.x )
		for( let i = 1; i < points.length; ++i )
		{
			const curPoint = this.modelRef.GetTransPoint( this.faceData[i] ).Copy().Project()
			if( curPoint.x < rect.left ) rect.left = curPoint.x
			if( curPoint.x > rect.right ) rect.right = curPoint.x
			if( curPoint.y > rect.top ) rect.top = curPoint.y
			if( curPoint.y < rect.bot ) rect.bot = curPoint.y
		}
		
		return( rect )
	}
	
	GetPoints()
	{
		const shape = []
		for( const i in this.faceData )
		{
			shape.push( this.modelRef.shape[i] )
		}
		return( shape )
	}
	
	GetColor()
	{
		let ind = this.ind
		const nColors = this.modelRef.colors.length
		while( ind >= nColors ) ind -= nColors
		return( this.modelRef.colors[this.ind] )
	}
	
	CalcMaxDistToPoint( point )
	{
		let maxDist = -Infinity
		for( const ind of this.faceData )
		{
			const curDistCalc = this.modelRef.GetTransPoint( ind )
				.Copy().Subtract( point ).GetDistSq()
			if( curDistCalc > maxDist ) maxDist = curDistCalc
		}
		return( maxDist )
	}
	GetCenter()
	{
		const center = Vec3.Zero()
		for( const ind of this.faceData )
		{
			const transPoint = this.modelRef.GetTransPoint( ind )
			center.Add( transPoint )
		}
		center.Divide( this.faceData.length )
		return( center )
	}
}

NekoModel.GenCube = function( w = 0.5,h = 0.5,d = 0.5,colors = [] )
{
	const shape = [
		new Vec3( -w,h,d ), // top front left
		new Vec3( w,h,d ), // top front right
		new Vec3( w,h,-d ), // top back right
		new Vec3( -w,h,-d ), // top back left
		
		new Vec3( -w,-h,d ), // bot front left
		new Vec3( w,-h,d ), // bot front right
		new Vec3( w,-h,-d ), // bot back right
		new Vec3( -w,-h,-d ) // bot back left
		
		// new Vec3( w,-h,-d ), // bot back right
		// new Vec3( -w,-h,-d ), // bot back left
		// new Vec3( w,h,-d ), // top back right
		// new Vec3( -w,h,-d ), // top back left
		// 
		// new Vec3( w,-h,d ), // bot front right
		// new Vec3( -w,-h,d ), // bot front left
		// new Vec3( w,h,d ), // top front right
		// new Vec3( -w,h,d ) // top front left
	]
	const faces = [
		[ 0,1,2,3 ], // top
		[ 4,5,6,7 ], // bot
		[ 0,3,7,4 ], // left
		[ 1,5,6,2 ], // right
		[ 0,4,5,1 ], // front
		[ 3,2,6,7 ] // back
		// [ 0,1,3,2 ], // top
		// [ 4,5,7,6 ], // bot
		// [ 1,5,7,3 ], // left
		// [ 0,4,6,2 ], // right
		// [ 1,0,4,5 ], // front
		// [ 2,3,7,6 ] // back
	]
	
	// fill color array if empty, or fill it the rest of the way if necessary
	for( let i = colors.length; i < faces.length; ++i ) colors.push( NekoUtils.RandColor() )
	
	return( new NekoModel( shape,faces,colors ) )
}