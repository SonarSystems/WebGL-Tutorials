main( );

function NormalisedToDevice( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var deviceCoord = ( coord + 1 ) * halfAxisSize;

	return deviceCoord;
}

function DeviceToNormalised( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var normalisedCoord = ( coord / halfAxisSize ) - 1;

	return normalisedCoord;
}

function main( )
{
	const canvas = document.querySelector( "#glcanvas" );

	const gl = canvas.getContext( "webgl" );

	if ( !gl )
	{
		alert( "Unable to setup WebGL. Your browser or computer may not support it." );

		return;
	}

	var vertices = [
		0.5, 0.5, 0.0, // 4th - 3
    	-0.5, -0.5, 0.0, // 2nd - 1
    	-0.5, 0.5, 0.0, // 1st - 0
    	0.5, 0.5, 0.0, // 4th - 3
    	0.5, -0.5, 0.0, // 3rd - 2
    	-0.5, -0.5, 0.0, // 2nd - 1
    ];

    var colors = [
    	0.0, 1.0, 0.0,
    	0.0, 1.0, 0.0,
    	0.0, 1.0, 0.0,
    	0.0, 0.0, 1.0,
    	0.0, 0.0, 1.0,
    	0.0, 0.0, 1.0,
    ];

	var vertex_buffer = gl.createBuffer( );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	gl.bindBuffer( gl.ARRAY_BUFFER, null );


    // Unbind the buffer
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

    var color_buffer = gl.createBuffer( );

    gl.bindBuffer( gl.ARRAY_BUFFER, color_buffer );

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );

	var vertCode = 
		'attribute vec3 coordinates;' +
		'attribute vec3 color;' +
		'varying vec3 vColor;' +
		'void main(void)' +
		'{' +
			' gl_Position = vec4(coordinates, 1.0);' +
			'vColor = color;'+
		'}';

	var vertShader = gl.createShader( gl.VERTEX_SHADER );

	gl.shaderSource( vertShader, vertCode );

	gl.compileShader( vertShader );

	var fragCode = 
		'precision highp float;' +
		'varying vec3 vColor;' +
		'void main(void)' +
		'{' +
			' gl_FragColor = vec4(vColor, 0.1);' +
		'}';

	var fragShader = gl.createShader( gl.FRAGMENT_SHADER );

	gl.shaderSource( fragShader, fragCode );

	gl.compileShader( fragShader );

	var shaderProgram = gl.createProgram( );

	gl.attachShader( shaderProgram, vertShader );

	gl.attachShader( shaderProgram, fragShader );

	gl.linkProgram( shaderProgram );

	gl.useProgram( shaderProgram );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	var coord = gl.getAttribLocation( shaderProgram, "coordinates" );

	gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );

	gl.enableVertexAttribArray( coord );

	gl.bindBuffer( gl.ARRAY_BUFFER, color_buffer );

	var color = gl.getAttribLocation( shaderProgram, "color" );

	gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );

	gl.enableVertexAttribArray( color );

	gl.clearColor( 1.0, 0.0, 0.0, 1.0 );

	gl.enable( gl.DEPTH_TEST );

	gl.clear( gl.COLOR_BUFFER_BIT );

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}











