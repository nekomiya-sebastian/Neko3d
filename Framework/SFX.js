class SFX
{
	constructor( path,vol = 0.5 )
	{
		this.sfx = new Audio( path )
		this.sfx.volume = vol
		
		this.loaded = false
		
		const self = this
		this.sfx.oncanplaythrough = function()
		{
			self.loaded = true
		}
		this.sfx.onerror = function()
		{
			NekoUtils.Assert( false,"SFX failed to load! " + path )
			self.loaded = false
		}
	}
	
	Play()
	{
		this.sfx.currentTime = 0
		this.sfx.play()
	}
	
	Loop()
	{
		this.sfx.loop = true
		this.Play()
	}
	
	IsPlaying()
	{
		return( !this.sfx.paused )
	}
}

SFX.GenSFXList = function( path,count,suffix = ".mp3" )
{
	const list = []
	
	for( let i = 0; i < count; ++i )
	{
		list.push( new SFX( path + ( i + 1 ) + suffix ) )
	}
	
	return( list )
}