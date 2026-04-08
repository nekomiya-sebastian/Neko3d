class SingleKey
{
	constructor( key )
	{
		this.keycode = key.charCodeAt( 0 )
		this.canPress = true
	}
	
	Update( kbd )
	{
		if( kbd.IsKeycodeDown( this.keycode ) )
		{
			const result = this.canPress
			this.canPress = false
			return( result )
		}
		else this.canPress = true
		
		return( false )
	}
}

SingleKey.Code = function( keycode )
{
	const singleKey = new SingleKey( "a" )
	singleKey.keycode = keycode
	return( singleKey )
}