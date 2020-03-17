
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
		// X, Y, Z         U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

	var indices = [
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var vertex_buffer = gl.createBuffer( );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Create an empty buffer object to store Index buffer
    var index_buffer = gl.createBuffer( );

    // Bind appropriate array buffer to it
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer );

    // Pass the vertex data to the buffer
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices ), gl.STATIC_DRAW );
    
    // Unbind the buffer
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );


    var vertCode = 
    [
    	'precision mediump float;',
		'attribute vec3 position;',
        'uniform mat4 Pmatrix;',
        'uniform mat4 Vmatrix;',
        'uniform mat4 Mmatrix;',
        'attribute vec2 textureCoord;',
        'varying vec2 vTextureCoord;',
        'void main( void )',
        '{' ,
           'gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4( position, 1.0 );',
           'vTextureCoord = textureCoord;',
        '}'
    ].join( "\n" );

	var vertShader = gl.createShader( gl.VERTEX_SHADER );

	gl.shaderSource( vertShader, vertCode );

	gl.compileShader( vertShader );

	var fragCode = 
	[
		'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D sampler;',
        'void main( void )',
        '{',
        	'gl_FragColor = texture2D(sampler, vTextureCoord);',
		'}'
	].join( "\n" );

	var fragShader = gl.createShader( gl.FRAGMENT_SHADER );

	gl.shaderSource( fragShader, fragCode );

	gl.compileShader( fragShader );

	var shaderProgram = gl.createProgram( );

	gl.attachShader( shaderProgram, vertShader );

	gl.attachShader( shaderProgram, fragShader );

	gl.linkProgram( shaderProgram );

	gl.useProgram( shaderProgram );

	/* ====== Associating attributes to vertex shader =====*/
    var Pmatrix = gl.getUniformLocation( shaderProgram, "Pmatrix" );
    var Vmatrix = gl.getUniformLocation( shaderProgram, "Vmatrix" );
    var Mmatrix = gl.getUniformLocation( shaderProgram, "Mmatrix" );

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var position = gl.getAttribLocation( shaderProgram, "position" );
    gl.vertexAttribPointer(position, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0) ;

    // Position Buffer Binding
    gl.enableVertexAttribArray( position );
    
    var texture = gl.getAttribLocation( shaderProgram, "textureCoord");
    gl.vertexAttribPointer( texture, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT ) ;

    gl.enableVertexAttribArray( texture );

    var boxTexture = gl.createTexture( );
    gl.bindTexture( gl.TEXTURE_2D, boxTexture );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById( "i2" ) );

    gl.bindTexture( gl.TEXTURE_2D, null );


    gl.useProgram( shaderProgram );

    /*==================== MATRIX =====================*/

    function get_projection( angle, a, zMin, zMax )
    {
       var ang = Math.tan( ( angle * 0.5 ) * Math.PI / 180 );
       
       return [
          0.5 / ang, 0 , 0, 0,
          0, 0.5 * a / ang, 0, 0,
          0, 0, - ( zMax + zMin ) / ( zMax - zMin ), -1,
          0, 0, ( -2 * zMax * zMin ) / ( zMax - zMin ), 0 
       ];
    }

    var proj_matrix = get_projection( 40, canvas.width / canvas.height, 1, 100) ;

    var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

    // Translating z
    view_matrix[14] = view_matrix[14] - 6;

    /*==================== Rotation ====================*/

    function rotateX( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    	m[1] = m[1] * c - m[2] * s;
    	m[5] = m[5] * c - m[6] * s;
    	m[9] = m[9] * c - m[10] * s;

    	m[2] = m[2] * c + mv1 * s;
    	m[6] = m[6] * c + mv5 * s;
    	m[10] = m[10] * c + mv9 * s;
    }

    function rotateY( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] + s * m[2];
    	m[4] = c * m[4] + s * m[6];
    	m[8] = c * m[8] + s * m[10];

    	m[2] = c * m[2] - s * mv0;
    	m[6] = c * m[6] - s * mv4;
    	m[10] = c * m[10] - s * mv8;
    }

    function rotateZ( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] - s * m[1];
    	m[4] = c * m[4] - s * m[5];
    	m[8] = c * m[8] - s * m[9];

    	m[1]=c * m[1] + s * mv0;
    	m[5]=c * m[5] + s * mv4;
    	m[9]=c * m[9] + s * mv8;
    }

	var previous_time = 0;

    var animate = function( time )
    {
    	var dt = time - previous_time;
    	rotateZ( mov_matrix, dt * 0.001 );//time
    	rotateY( mov_matrix, dt * 0.0004 );
    	rotateX( mov_matrix, dt * 0.0006 );
    	previous_time = time;

    	gl.enable( gl.DEPTH_TEST );
    	gl.depthFunc( gl.LEQUAL );
    	gl.clearColor( 0.5, 0.5, 0.5, 0.9 );
    	gl.clearDepth( 1.0 );

    	gl.viewport( 0.0, 0.0, canvas.width, canvas.height );
    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    	gl.uniformMatrix4fv( Pmatrix, false, proj_matrix );
    	gl.uniformMatrix4fv( Vmatrix, false, view_matrix );
    	gl.uniformMatrix4fv( Mmatrix, false, mov_matrix );
    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer );

    	gl.bindTexture( gl.TEXTURE_2D, boxTexture );
    	gl.activeTexture( gl.TEXTURE0 );

    	gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

    	window.requestAnimationFrame( animate );
    }

    animate( 0 );
}











