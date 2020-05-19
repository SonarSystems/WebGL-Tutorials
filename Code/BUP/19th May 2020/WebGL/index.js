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

	var cameraObj = new Camera( canvas );

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

	var index_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );

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
		'void main()',
		'{',
			'vTextureCoord = textureCoord;',
			'gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);',
		'}'
	].join( '\n' );

	var vertShader = gl.createShader( gl.VERTEX_SHADER );
	
	gl.shaderSource( vertShader, vertCode );
	
	gl.compileShader( vertShader );

	var fragCode =
	[
		'precision mediump float;',
		'varying vec2 vTextureCoord;',
		'uniform sampler2D sampler;',
		'void main()',
		'{',
			'gl_FragColor = texture2D(sampler, vTextureCoord);',
		'}'
	].join( '\n' );

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

    gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
	var position = gl.getAttribLocation( shaderProgram, 'position' );
	gl.vertexAttribPointer(
		position, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	// Position Buffer Binding
	gl.enableVertexAttribArray( position );

	var texture = gl.getAttribLocation( shaderProgram, 'textureCoord' );
	gl.vertexAttribPointer(
		texture, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	
	gl.enableVertexAttribArray( texture );

	// Create texture
	var boxTexture = gl.createTexture( );
	gl.bindTexture( gl.TEXTURE_2D, boxTexture );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById( 'CrateImage' )
	);
	gl.bindTexture( gl.TEXTURE_2D, null );



	gl.useProgram( shaderProgram );
    
    
    var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	var mov_matrix2 = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

	var previous_time = 0;
	var animate = function( time )
    {
 		mov_matrix[12] = 1;
    	mov_matrix[13] = 0;
    	mov_matrix[14] = -10;

    	mov_matrix2[12] = 0;
    	mov_matrix2[13] = 0;
    	mov_matrix2[14] = 0;

    	cameraObj.Update( );
		var dt = time - previous_time;

    	cameraObj.RotateZ( mov_matrix, dt * 0.001 );
    	cameraObj.RotateY( mov_matrix, dt * 0.0004 );
    	cameraObj.RotateX( mov_matrix, dt * 0.0006 );

    	cameraObj.RotateZ( mov_matrix2, dt * 0.000 );
    	cameraObj.RotateY( mov_matrix2, dt * 0.001 );
    	cameraObj.RotateX( mov_matrix2, dt * 0.000 );



    	previous_time = time;

    	

		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
    	gl.clearColor( 0.5, 0.5, 0.5, 0.9 );
    	gl.clearDepth( 1.0 );

		gl.viewport( 0.0, 0.0, canvas.width, canvas.height );
    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    	gl.bindTexture( gl.TEXTURE_2D, boxTexture );
		gl.activeTexture( gl.TEXTURE0 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer );

        gl.uniformMatrix4fv( Pmatrix, false, proj_matrix );
    	gl.uniformMatrix4fv( Vmatrix, false, view_matrix );
    	gl.uniformMatrix4fv( Mmatrix, false, cameraObj.UpdateMovMatrix( mov_matrix ) );
		gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

		gl.uniformMatrix4fv( Pmatrix, false, proj_matrix );
    	gl.uniformMatrix4fv( Vmatrix, false, view_matrix );
    	gl.uniformMatrix4fv( Mmatrix, false, cameraObj.UpdateMovMatrix( mov_matrix2 ) );
		gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

   
		window.requestAnimationFrame( animate );

    }

    animate( 0 );
}