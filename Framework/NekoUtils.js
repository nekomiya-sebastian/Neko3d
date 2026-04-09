class NekoUtils {}

NekoUtils.Assert = function( condition,msg )
{
	if( !condition )
	{
		console.log( msg ? msg : "Assert triggered!" )
		// console.trace()
	}
}

NekoUtils.RandInt = function( min,max )
{
	return( Math.floor( Math.random() * ( max - min ) + min ) )
}

NekoUtils.RandFloat = function( min,max )
{
	return( ( Math.random() * ( max - min ) ) + min )
}

NekoUtils.RandColor = function()
{
	let color = "#"
	
	for( let i = 0; i < 6; ++i )
	{
		const choice = NekoUtils.RandInt( 0,9 + 6 )
		if( choice < 9 ) color += NekoUtils.RandInt( 0,9 ).toString()
		else color += String.fromCharCode( 65 + NekoUtils.RandInt( 0,6 ) )
	}
	
	return( color )
}

NekoUtils.Choose = function()
{
	return( NekoUtils.Chance( 0.5 ) )
}

NekoUtils.Chance = function( chance )
{
	return( NekoUtils.RandFloat( 0,1 ) < chance )
}

NekoUtils.ArrayChooseRand = function( arr )
{
	return( arr[NekoUtils.RandInt( 0,arr.length )] )
}

NekoUtils.ArrayIncludes = function( arr,func )
{
	for( const item of arr )
	{
		if( func( item ) ) return( true )
	}
	return( false )
}

NekoUtils.ShuffleArr = function( arr )
{
	// the arr.sort method doesn't seem to actually shuffle very well...
	//  I guess cuz it's sorting not shuffling XD
	// arr.sort( function( a,b ) { return( Math.random() - 0.5 ) } )
	
	// Fisher-Yates shuffle - https://bost.ocks.org/mike/shuffle/
	let ind = arr.length
	
	while( ind > 0 )
	{
		const curInd = Math.floor( Math.random() * ind-- )
		
		const temp = arr[ind]
		arr[ind] = arr[curInd]
		arr[curInd] = temp
	}
	
	return( arr )
}

NekoUtils.OverflowClamp = function( val,clampMin,clampMax )
{
	const clampRange = clampMax - clampMin
	while( val < clampMin ) val += clampRange
	while( val > clampMax ) val -= clampRange
	return( val )
}
NekoUtils.Clamp = function( val,minVal,maxVal )
{
	if( val < minVal ) val = minVal
	if( val > maxVal ) val = maxVal
	return( val )
}