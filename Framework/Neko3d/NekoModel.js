class NekoModel
{
	constructor( shape,faces,colors,
		pos = Vec3.Zero(),rot = Vec3.Zero(),scale = 1 )
	{
		this.shape = shape
		this.faces = faces
		this.colors = colors
		// we need this since color indices will be jumbled with multiple models
		NekoUtils.Assert( this.faces.length == this.colors.length,
			"Mismatching face count and colors list length!" )
		
		this.trans = new Transneko( pos,rot,scale )
		this.transPoints = []
		
		this.center = Vec3.Zero()
		this.norms = []
		
		this.litCols = []
		this.invalidateLighting = true
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
	
	GenTransPoints( neko3dCam,light = null )
	{
		if( this.trans.invalidatePoints )
		{
			// set trans points based on self
			this.trans.FillTransPointsList( this.shape,this.transPoints )
			
			// then cam transform (& cache center of all points to be used for normals)
			this.center.SetXYZ( 0,0,0 )
			for( const point of this.transPoints )
			{
				neko3dCam.TransPoint( point )
				this.center.Add( point )
			}
			this.center.Divide( this.transPoints.length )
			
			this.trans.invalidatePoints = false
			
			// calc face lighting
			
			// fill litCols arr once so we only set later to reduce memory footprint
			for( let i = this.litCols.length; i < this.colors.length; ++i )
			{
				this.litCols.push( this.colors[i].Copy() )
			}
		}
			
		if( light && this.invalidateLighting )
		{
			const lightAng = light.CalcForward()
			this.trans.GetRotMat().Apply( lightAng,true )
			neko3dCam.GetRotMat().Apply( lightAng,true )
			
			const nekoFaces = this.GetFaces()
			for( let i = 0; i < nekoFaces.length; ++i )
			{
				if( this.trans.invalidateNorms ) this.RecalcNorm( nekoFaces,i )
				
				// <0 = pointing same dir, >0 = opposite, =0 = perpendicular
				// const curDot = light.CalcForward().Dot( this.norms[i] )
				const curDot = lightAng.Dot( this.norms[i] )
				light.LightColor( curDot,this.colors[i],this.litCols[i] )
			}
			this.invalidateLighting = false
			this.trans.invalidateNorms = false
		}
		
		return( this.transPoints )
	}
	GetTransPoint( ind )
	{
		// use cached points
		NekoUtils.Assert( ind > -1 && ind < this.shape.length )
		return( this.transPoints[ind] )
	}
	
	RecalcNorm( nekoFaces,ind )
	{
		this.norms[ind] = nekoFaces[ind].GetCenter().Subtract( this.center ).Normalize()
	}
	
	GetFaces()
	{
		const nekoFaces = []
		for( let i = 0; i < this.faces.length; ++i )
		{
			nekoFaces.push( new NekoModelFace( this.faces[i],this,i ) )
			if( this.trans.invalidateNorms ) this.RecalcNorm( nekoFaces,i )
		}
		this.trans.invalidateNorms = false
		return( nekoFaces )
	}
	
	InvalidateLighting()
	{
		this.invalidateLighting = true
	}
	InvalidateNorms()
	{
		this.trans.invalidateNorms = true
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
	
	FacingCam( neko3dCam )
	{
		// const dotResult = neko3dCam.CalcForward().Dot( this.modelRef.norms[this.ind] )
		const dotResult = Vec3.Forward().Dot( this.modelRef.norms[this.ind] )
		return( dotResult < 0 ) // <0 = pointing same dir, >0 = opposite, =0 = perpendicular
		// (it's backwards from what it should be I know shut up)
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
		const nColors = this.modelRef.litCols.length
		while( ind >= nColors ) ind -= nColors
		return( this.modelRef.litCols[this.ind] )
	}
	GetDrawableColor()
	{
		return( this.GetColor().GetDrawableColor() )
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
	]
	const faces = [
		[ 0,1,2,3 ], // top
		[ 4,5,6,7 ], // bot
		[ 0,3,7,4 ], // left
		[ 1,5,6,2 ], // right
		[ 0,4,5,1 ], // front
		[ 3,2,6,7 ] // back
	]
	
	// fill color array if empty, or fill it the rest of the way if necessary
	for( let i = colors.length; i < faces.length; ++i ) colors.push( Nekolor.RandColor() )
	
	return( new NekoModel( shape,faces,colors ) )
}

// lat is how many points around
// long is how many points tall
NekoModel.GenerateGlobe = function( radius,nLat,nLong,color = null )
{
	NekoUtils.Assert( nLat > 2,"Invalid globe nLat, can't generate 3d shape this way!" )
	NekoUtils.Assert( nLong > 0,"Invalid globe nLong, can't generate 3d shape this way!" )
	
	const shape = []
	
	// generate poles
	shape.push( Vec3.Up().Scale( radius ) )
	shape.push( Vec3.Down().Scale( radius ) )
	
	const longAng = Math.PI / ( nLong + 1 )
	const latAng = ( Math.PI * 2.0 ) / nLat
	const minLon = -Math.floor( nLong / 2 )
	const maxLon = Math.ceil( nLong / 2 )
	const lonOffset = ( nLong % 2 == 0 ? 0.5 : 0 )
	
	// precache lat mats so we can avoid recalcing unnecessarily
	const latMats = []
	for( let i = 0; i < nLat; ++i ) latMats.push( Mat3.GetYRotMat( latAng * i ) )
	
	for( let lon = minLon; lon < maxLon; ++lon )
	{
		const lonMat = Mat3.GetZRotMat( longAng * ( lon + lonOffset ) )
		for( let lat = 0; lat < nLat; ++lat )
		{
			const point = Vec3.Right().Scale( radius )
			
			const rotMat = lonMat.Copy().MatMult( latMats[lat] )
			
			rotMat.Apply( point,true )
			
			shape.push( point )
		}
	}
	
	const faces = []
	// add a temporary face with all points for testing
	for( let i = 0; i < shape.length; ++i ) faces.push( [ i ] )
	
	// these are backwards I know
	const topPoleInd = 1
	const botPoleInd = 0
	const latStart = 2
	
	// bot faces
	for( let i = 0; i < nLat; ++i )
	{
		const nextLat = ( i == nLat - 1 ? latStart : i + latStart + 1 ) // loop to first on last
		
		faces.push( [ botPoleInd,i + latStart,nextLat ] )
	}
	
	// above row is row below offset by +1
	// middle faces
	for( let i = 0; i < nLong - 1; ++i )
	{
		const curLatStart = latStart + ( ( i + 1 ) * nLat )
		for( let j = 0; j < nLat; ++j )
		{
			const nextLat = ( j == nLat - 1 ? curLatStart : j + curLatStart + 1 )
			
			faces.push( [ j + curLatStart,nextLat,
				nextLat - nLat,j + curLatStart - nLat ] )
		}
	}
	
	// top faces
	const topLatStart = latStart + ( nLong - 1 ) * nLat
	for( let i = 0; i < nLat; ++i )
	{
		const nextLat = ( i == nLat - 1 ? topLatStart : i + topLatStart + 1 ) // loop to first on last
		
		faces.push( [ topPoleInd,i + topLatStart,nextLat ] )
	}
	
	const colors = []
	for( let i = 0; i < faces.length; ++i )
	{
		colors.push( color == null ? Nekolor.RandColor() : color )
	}
	
	return( new NekoModel( shape,faces,colors ) )
}