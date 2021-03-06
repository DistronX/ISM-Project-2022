# -*- coding: utf-8 -*-
"""
Implementation of an efficient and robust image encryption scheme for medical
applications, as described by A. Kanso and M. Ghebleh.

DOI: 10.1016/j.cnsns.2014.12.005
Bibliographic code: 2015CNSNS..24...98K

@author: Javier Castillo Delgado
@author: Javier Centeno Vega
@author: Manuel Macho Becerra
"""

import numpy
import math
from matrixutil import vector
from byteutil import to_bytes

import imageutil

def a_matrix(a, b, c, d):
	"""
	Parameters
	----------
	a : int
		A parameter used to generate the matrix.
	b : int
		A parameter used to generate the matrix.
	c : int
		A parameter used to generate the matrix.
	d : int
		A parameter used to generate the matrix.
	
	Returns
	-------
	a : numpy.ndarray
		A two dimensional matrix with dimensions (4, 4) used in pseudorandom
		number generation for the encryption algorithm.
	"""
	return numpy.array(
			[
				[
					(2*b + c)*(d + 1) + 3*d + 1,
					2*(b + 1),
					2*b*c + c + 3,
					4*b + 3
				],
				[
					2*(a + 1)*(d + b*c*(d + 1)) + a*(c + 1)*(d + 1),# E
					2*(a + b + a*b) + 1,
					a*(c + 3) + 2*b*c*(a + 1) + 2,# F
					3*a + 4*b*(a + 1) + 1
				],
				[
					3*b*c*(d + 1) + 3*d,
					3*b + 1,
					3*b*c + 3,
					6*b + 1
				],
				[
					c*(b + 1)*(d + 1) + d,
					b + 1,
					b*c + c + 1,
					2*b + 2
				]
			]
		)

def cat_map(a, b):
	"""
	Parameters
	----------
	a : int
		A parameter used to generate the matrix.
	b : int
		A parameter used to generate the matrix.
	
	Returns
	-------
	a : numpy.ndarray
		A two dimensional matrix with dimensions (2, 2) used to generate the cat
		map in the shuffling phase of the encryption algorithm.
	"""
	return numpy.array(
			[
				[
					1,
					a
				],
				[
					b,
					a*b + 1
				]
			]
		)

def omega_matrix(a, x, height, width):
	"""
	Parameters
	----------
	a : numpy.ndarray
		A two dimensional matrix with dimensions (4, 4).
	x : numpy.ndarray
		A column vector, or two dimensional matrix with dimensions (1, 4).
	height : int
		Height of the resulting matrix.
	width : int
		Width of the resulting matrix.
	
	Returns
	-------
	tuple
		A tuple consisting of the omega and y matrices used in the encryption
		algorithm.
	"""
	l = height*width
	y = []
	z = []
	u = vector(2, 3, 5, 1)

	for i in range(math.ceil(l/16.0)):
		t = math.floor(numpy.dot(u, x)[0][0]) + 1

		for j in range(t):
			x = a.dot(x) % 1

		n = (numpy.floor(x * (2**32))).T

		y.append(x)
		z.append(vector(to_bytes(numpy.uint32(n), 4)))

	return (numpy.reshape(numpy.reshape(numpy.array(z), [math.ceil(l/16.0)*16])[:l], [height, width]), 
		numpy.reshape(numpy.array(y), [math.ceil(l/16.0)*4]))

def shuffling_sequence(a, x, n):
	"""
	Parameters
	----------
	a : numpy.ndarray
		A matrix used to compute the cat map transformation.
	x : numpy.ndarray
		A column vector on which the cat map transformation is applied.
	n : int
		The number of times the cat map transformation is iterated.
	
	Returns
	-------
	tuple
		The components of the result of the repeated cat map transformation.
	"""
	r1 = []
	r2 = []
	u = vector(2, 3)

	for i in range(n):
		t = math.floor(numpy.dot(u, x)[0][0]) + 1

		for j in range(t):
			x = a.dot(x) % 1

		r1.append(x[0][0])
		r2.append(x[1][0])

	r1 = [i[0] for i in sorted(enumerate(r1), key = lambda x : x[1])]
	r2 = [i[0] for i in sorted(enumerate(r2), key = lambda x : x[1])]

	return r1, r2

def shuffle_block(i, omega, l, a1, x1, a2, x2):
	"""
	Parameters
	----------
	i : numpy.ndarray
		A block of an image.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	l : int
		The number of times the cat map transformation is iterated in the
		shuffling sequence.
	a1 : numpy.ndarray
		A matrix used to compute the cat map transformation used in column
		shuffling.
	x1 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		column shuffling.
	a2 : numpy.ndarray
		A matrix used to compute the cat map transformation used in row
		shuffling.
	x2 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		row shuffling.
	
	Returns
	-------
	tuple
		A tuple consisting of the result of shuffling the given block and the
		omega matrix.
	"""
	s1 = shuffling_sequence(a1, x1, l)
	s2 = shuffling_sequence(a2, x2, l)

	#Shuffling de columnas
	i = numpy.array([[i[1] for i in sorted(enumerate(j), key = lambda x : s1[0][x[0]])] for j in i])
	omega = numpy.array([[i[1] for i in sorted(enumerate(j), key = lambda x : s1[1][x[0]])] for j in omega])

	#Shuffling de filas
	i = numpy.array([i[1] for i in sorted(enumerate(i), key = lambda x : s2[0][x[0]])])
	omega = numpy.array([i[1] for i in sorted(enumerate(omega), key = lambda x : s2[1][x[0]])])

	return i, omega

def shuffle_image(image, mask, omega, a1, x1, a2, x2):
	"""
	Parameters
	----------
	image : numpy.ndarray
		An image.
	mask : numpy.ndarray
		The mask defining the region of interest of the image as computed by
		divide_regions.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	a1 : numpy.ndarray
		A matrix used to compute the cat map transformation used in column
		shuffling.
	x1 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		column shuffling.
	a2 : numpy.ndarray
		A matrix used to compute the cat map transformation used in row
		shuffling.
	x2 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		row shuffling.
	
	Returns
	-------
	numpy.ndarray
		The result of shuffling the image.
	"""
	s = len(image) // len(mask)
	res = numpy.zeros_like(image)

	for i in range(len(mask[0])):
		for j in range(len(mask)):
			if not mask[j][i]:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = image[j*s:(j+1)*s, i*s:(i+1)*s]

			else:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = shuffle_block(image[j*s:(j+1)*s, i*s:(i+1)*s], 
														omega, s, a1, x1, a2, x2)[0]

	return res

def unshuffle_block(i, omega, l, a1, x1, a2, x2):
	"""
	Parameters
	----------
	i : numpy.ndarray
		A shuffled block of an image.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	l : int
		The number of times the cat map transformation is iterated in the
		shuffling sequence.
	a1 : numpy.ndarray
		A matrix used to compute the cat map transformation used in column
		shuffling.
	x1 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		column shuffling.
	a2 : numpy.ndarray
		A matrix used to compute the cat map transformation used in row
		shuffling.
	x2 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		row shuffling.
	
	Returns
	-------
	tuple
		A tuple consisting of the result of unshuffling the given block and the
		omega matrix.
	"""
	s1 = shuffling_sequence(a1, x1, l)
	s2 = shuffling_sequence(a2, x2, l)

	#Shuffling de columnas
	i = numpy.array([[i[1] for i in sorted(zip(numpy.argsort(s1[0]), j), key = lambda x : x[0])] for j in i])
	omega = numpy.array([[i[1] for i in sorted(zip(numpy.argsort(s1[1]), j), key = lambda x : x[0])] for j in omega])

	#Shuffling de filas
	i = numpy.array([i[1] for i in sorted(zip(numpy.argsort(s2[0]), i), key = lambda x : x[0])])
	omega = numpy.array([i[1] for i in sorted(zip(numpy.argsort(s2[1]), i), key = lambda x : x[0])])

	return i, omega

def unshuffle_image(image, mask, omega, a1, x1, a2, x2):
	"""
	Parameters
	----------
	image : numpy.ndarray
		A shuffled image.
	mask : numpy.ndarray
		The mask defining the region of interest of the image as computed by
		divide_regions.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	a1 : numpy.ndarray
		A matrix used to compute the cat map transformation used in column
		shuffling.
	x1 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		column shuffling.
	a2 : numpy.ndarray
		A matrix used to compute the cat map transformation used in row
		shuffling.
	x2 : numpy.ndarray
		A column vector on which the cat map transformation is applied used in
		row shuffling.
	
	Returns
	-------
	numpy.ndarray
		The result of unshuffling the image.
	"""
	s = len(image) // len(mask)
	res = numpy.zeros_like(image)

	for i in range(len(mask[0])):
		for j in range(len(mask)):
			if not mask[j][i]:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = image[j*s:(j+1)*s, i*s:(i+1)*s]

			else:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = unshuffle_block(image[j*s:(j+1)*s, i*s:(i+1)*s], 
														omega, s, a1, x1, a2, x2)[0]

	return res

def mask_block(i, omega, l, y):
	"""
	Parameters
	----------
	i : numpy.ndarray
		A block of an image.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	l : int
		The block lenght.
	y : numpy.ndarray
		The y matrix used in the encryption algorithm.
	
	Returns
	-------
	numpy.ndarray
		The masked block.
	"""
	p = 1

	for j in range(l):
		o = (int)(1 + (omega.T[j].dot(numpy.array([numpy.product(i) for i in numpy.transpose(i, (1, 0, 2))])) % math.floor((l*l)/4)))
		numpy.roll(omega.T[j], -p)
		p = 1 + math.floor(l*y[o])

		for k in range(l):
			i[k][j] = (i[k][j] + omega[j][k]) % 256

	return i

def mask_image(image, mask, omega, y):
	"""
	Parameters
	----------
	image : numpy.ndarray
		An image.
	mask : numpy.ndarray
		A two dimensional matrix indicating which blocks need to be masked.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	y : numpy.ndarray
		The y matrix used in the encryption algorithm.
	
	Returns
	-------
	numpy.ndarray
		The masked image.
	"""
	s = len(image) // len(mask)
	res = numpy.zeros_like(image)

	for i in range(len(mask[0])):
		for j in range(len(mask)):
			if not mask[j][i]:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = image[j*s:(j+1)*s, i*s:(i+1)*s]

			else:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = mask_block(image[j*s:(j+1)*s, i*s:(i+1)*s], omega, s, y)

	return res

def unmask_block(i, omega, l, y):
	for j in reversed(range(l)):
		for k in range(l):
			i[k][j] = (i[k][j] - omega[j][k]) % 256

	return i

def unmask_image(image, mask, omega, y):
	"""
	Parameters
	----------
	image : numpy.ndarray
		An image.
	mask : numpy.ndarray
		A two dimensional matrix indicating which blocks need to be masked.
	omega : numpy.ndarray
		The omega matrix used in the encryption algorithm.
	y : numpy.ndarray
		The y matrix used in the encryption algorithm.
	
	Returns
	-------
	numpy.ndarray
		The masked image.
	"""
	s = len(image) // len(mask)
	res = numpy.zeros_like(image)

	for i in range(len(mask[0])):
		for j in range(len(mask)):
			if not mask[j][i]:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = image[j*s:(j+1)*s, i*s:(i+1)*s]

			else:
				res[j*s:(j+1)*s, i*s:(i+1)*s] = unmask_block(image[j*s:(j+1)*s, i*s:(i+1)*s], omega, s, y)

	return res

def cypher_image(image, a_matrix, a_vector, cat_map1, cat_map1_init, cat_map2, cat_map2_init, block_size, std_limit):
	omega, y = omega_matrix(a_matrix, a_vector, block_size, block_size)

	paddedImage, shape = imageutil.pad_image(image, block_size)

	mask = imageutil.divide_regions(paddedImage, block_size, std_limit)

	shuffled_image = shuffle_image(paddedImage.copy(), mask, omega, cat_map1, cat_map1_init, cat_map2, cat_map2_init)
	masked_image = mask_image(shuffled_image.copy(), mask, omega, y)

	return masked_image, mask, shape

def decypher_image(image, mask, shape, a_matrix, a_vector, cat_map1, cat_map1_init, cat_map2, cat_map2_init, block_size):
	omega, y = omega_matrix(a_matrix, a_vector, block_size, block_size)

	unmasked_image = unmask_image(image.copy(), mask, omega, y)
	unshuffled_image = unshuffle_image(unmasked_image.copy(), mask, omega, cat_map1, cat_map1_init, cat_map2, cat_map2_init)

	return imageutil.unpad_image(unshuffled_image, shape)