// @ts-nocheck
import defaultValue from "../utils/defaultValue";
import defined from "../utils/defined";
import CesiumMath from "./Math";
/**
 * A 2D Cartesian point.
 * @alias Cartesian2
 * @constructor
 *
 * @param {Number} [x=0.0] The X component.
 * @param {Number} [y=0.0] The Y component.
 *
 * @see Cartesian3
 * @see Cartesian4
 * @see Packable
 */
class Cartesian2{
  constructor(x:number=0.0, y:number=0.0){
   this.x = x;
   this.y =y;
  }
  /**
 * Creates a Cartesian2 instance from x and y coordinates.
 *
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 */
static fromElements(x:number, y:number, result) {
  if (!defined(result)) {
    return new Cartesian2(x, y);
  }

  result.x = x;
  result.y = y;
  return result;
};

/**
 * Duplicates a Cartesian2 instance.
 *
 * @param {Cartesian2} cartesian The Cartesian to duplicate.
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided. (Returns undefined if cartesian is undefined)
 */
 static clone (cartesian, result) {
  if (!defined(cartesian)) {
    return undefined;
  }
  if (!defined(result)) {
    return new Cartesian2(cartesian.x, cartesian.y);
  }

  result.x = cartesian.x;
  result.y = cartesian.y;
  return result;
};

/**
 * Creates a Cartesian2 instance from an existing Cartesian3.  This simply takes the
 * x and y properties of the Cartesian3 and drops z.
 * @function
 *
 * @param {Cartesian3} cartesian The Cartesian3 instance to create a Cartesian2 instance from.
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 */
Cartesian2.fromCartesian3 = Cartesian2.clone;

/**
 * Creates a Cartesian2 instance from an existing Cartesian4.  This simply takes the
 * x and y properties of the Cartesian4 and drops z and w.
 * @function
 *
 * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian2 instance from.
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 */
Cartesian2.fromCartesian4 = Cartesian2.clone;

/**
 * The number of elements used to pack the object into an array.
 * @type {Number}
 */
Cartesian2.packedLength = 2;

/**
 * Stores the provided instance into the provided array.
 *
 * @param {Cartesian2} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
 static pack (value, array, startingIndex) {

  startingIndex = defaultValue(startingIndex, 0);

  array[startingIndex++] = value.x;
  array[startingIndex] = value.y;

  return array;
};

/**
 * Retrieves an instance from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {Cartesian2} [result] The object into which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 */
 static unpack (array, startingIndex, result) {

  startingIndex = defaultValue(startingIndex, 0);

  if (!defined(result)) {
    result = new Cartesian2();
  }
  result.x = array[startingIndex++];
  result.y = array[startingIndex];
  return result;
};

/**
 * Flattens an array of Cartesian2s into an array of components.
 *
 * @param {Cartesian2[]} array The array of cartesians to pack.
 * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 2 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 2) elements.
 * @returns {Number[]} The packed array.
 */
 static packArray(array, result) {

  const length = array.length;
  const resultLength = length * 2;
  if (!defined(result)) {
    result = new Array(resultLength);
  } else if (!Array.isArray(result) && result.length !== resultLength) {
    //>>includeStart('debug', pragmas.debug);
    throw new Error(
      "If result is a typed array, it must have exactly array.length * 2 elements"
    );
    //>>includeEnd('debug');
  } else if (result.length !== resultLength) {
    result.length = resultLength;
  }

  for (let i = 0; i < length; ++i) {
    Cartesian2.pack(array[i], result, i * 2);
  }
  return result;
};

/**
 * Unpacks an array of cartesian components into an array of Cartesian2s.
 *
 * @param {Number[]} array The array of components to unpack.
 * @param {Cartesian2[]} [result] The array onto which to store the result.
 * @returns {Cartesian2[]} The unpacked array.
 */
 static unpackArray(array, result) {
  if (array.length % 2 !== 0) {
    throw new Error("array length must be a multiple of 2.");
  }
  //>>includeEnd('debug');

  const length = array.length;
  if (!defined(result)) {
    result = new Array(length / 2);
  } else {
    result.length = length / 2;
  }

  for (let i = 0; i < length; i += 2) {
    const index = i / 2;
    result[index] = Cartesian2.unpack(array, i, result[index]);
  }
  return result;
};

/**
 * Creates a Cartesian2 from two consecutive elements in an array.
 * @function
 *
 * @param {Number[]} array The array whose two consecutive elements correspond to the x and y components, respectively.
 * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 *
 * @example
 * // Create a Cartesian2 with (1.0, 2.0)
 * const v = [1.0, 2.0];
 * const p = Cesium.Cartesian2.fromArray(v);
 *
 * // Create a Cartesian2 with (1.0, 2.0) using an offset into an array
 * const v2 = [0.0, 0.0, 1.0, 2.0];
 * const p2 = Cesium.Cartesian2.fromArray(v2, 2);
 */
Cartesian2.fromArray = Cartesian2.unpack;

/**
 * Computes the value of the maximum component for the supplied Cartesian.
 *
 * @param {Cartesian2} cartesian The cartesian to use.
 * @returns {Number} The value of the maximum component.
 */
 static maximumComponent(cartesian) {
  return Math.max(cartesian.x, cartesian.y);
};

/**
 * Computes the value of the minimum component for the supplied Cartesian.
 *
 * @param {Cartesian2} cartesian The cartesian to use.
 * @returns {Number} The value of the minimum component.
 */
 static minimumComponent(cartesian) {
  return Math.min(cartesian.x, cartesian.y);
};

/**
 * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
 *
 * @param {Cartesian2} first A cartesian to compare.
 * @param {Cartesian2} second A cartesian to compare.
 * @param {Cartesian2} result The object into which to store the result.
 * @returns {Cartesian2} A cartesian with the minimum components.
 */
 static minimumByComponent(first, second, result) {

  result.x = Math.min(first.x, second.x);
  result.y = Math.min(first.y, second.y);

  return result;
};

/**
 * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
 *
 * @param {Cartesian2} first A cartesian to compare.
 * @param {Cartesian2} second A cartesian to compare.
 * @param {Cartesian2} result The object into which to store the result.
 * @returns {Cartesian2} A cartesian with the maximum components.
 */
 static maximumByComponent(first, second, result) {

  result.x = Math.max(first.x, second.x);
  result.y = Math.max(first.y, second.y);
  return result;
};

/**
 * Constrain a value to lie between two values.
 *
 * @param {Cartesian2} value The value to clamp.
 * @param {Cartesian2} min The minimum bound.
 * @param {Cartesian2} max The maximum bound.
 * @param {Cartesian2} result The object into which to store the result.
 * @returns {Cartesian2} The clamped value such that min <= result <= max.
 */
Cartesian2.clamp = function (value, min, max, result) {

  const x = CesiumMath.clamp(value.x, min.x, max.x);
  const y = CesiumMath.clamp(value.y, min.y, max.y);

  result.x = x;
  result.y = y;

  return result;
};

/**
 * Computes the provided Cartesian's squared magnitude.
 *
 * @param {Cartesian2} cartesian The Cartesian instance whose squared magnitude is to be computed.
 * @returns {Number} The squared magnitude.
 */
Cartesian2.magnitudeSquared = function (cartesian) {

  return cartesian.x * cartesian.x + cartesian.y * cartesian.y;
};

/**
 * Computes the Cartesian's magnitude (length).
 *
 * @param {Cartesian2} cartesian The Cartesian instance whose magnitude is to be computed.
 * @returns {Number} The magnitude.
 */
Cartesian2.magnitude = function (cartesian) {
  return Math.sqrt(Cartesian2.magnitudeSquared(cartesian));
};

const distanceScratch = new Cartesian2();

/**
 * Computes the distance between two points.
 *
 * @param {Cartesian2} left The first point to compute the distance from.
 * @param {Cartesian2} right The second point to compute the distance to.
 * @returns {Number} The distance between two points.
 *
 * @example
 * // Returns 1.0
 * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(2.0, 0.0));
 */
Cartesian2.distance = function (left, right) {

  Cartesian2.subtract(left, right, distanceScratch);
  return Cartesian2.magnitude(distanceScratch);
};

/**
 * Computes the squared distance between two points.  Comparing squared distances
 * using this function is more efficient than comparing distances using {@link Cartesian2#distance}.
 *
 * @param {Cartesian2} left The first point to compute the distance from.
 * @param {Cartesian2} right The second point to compute the distance to.
 * @returns {Number} The distance between two points.
 *
 * @example
 * // Returns 4.0, not 2.0
 * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(3.0, 0.0));
 */
Cartesian2.distanceSquared = function (left, right) {

  Cartesian2.subtract(left, right, distanceScratch);
  return Cartesian2.magnitudeSquared(distanceScratch);
};

/**
 * Computes the normalized form of the supplied Cartesian.
 *
 * @param {Cartesian2} cartesian The Cartesian to be normalized.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.normalize = function (cartesian, result) {

  const magnitude = Cartesian2.magnitude(cartesian);

  result.x = cartesian.x / magnitude;
  result.y = cartesian.y / magnitude;

  //>>includeStart('debug', pragmas.debug);
  if (isNaN(result.x) || isNaN(result.y)) {
    throw new Error("normalized result is not a number");
  }
  //>>includeEnd('debug');

  return result;
};

/**
 * Computes the dot (scalar) product of two Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @returns {Number} The dot product.
 */
Cartesian2.dot = function (left, right) {

  return left.x * right.x + left.y * right.y;
};

/**
 * Computes the magnitude of the cross product that would result from implicitly setting the Z coordinate of the input vectors to 0
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @returns {Number} The cross product.
 */
Cartesian2.cross = function (left, right) {

  return left.x * right.y - left.y * right.x;
};

/**
 * Computes the componentwise product of two Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.multiplyComponents = function (left, right, result) {

  result.x = left.x * right.x;
  result.y = left.y * right.y;
  return result;
};

/**
 * Computes the componentwise quotient of two Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.divideComponents = function (left, right, result) {

  result.x = left.x / right.x;
  result.y = left.y / right.y;
  return result;
};

/**
 * Computes the componentwise sum of two Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.add = function (left, right, result) {

  result.x = left.x + right.x;
  result.y = left.y + right.y;
  return result;
};

/**
 * Computes the componentwise difference of two Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.subtract = function (left, right, result) {

  result.x = left.x - right.x;
  result.y = left.y - right.y;
  return result;
};

/**
 * Multiplies the provided Cartesian componentwise by the provided scalar.
 *
 * @param {Cartesian2} cartesian The Cartesian to be scaled.
 * @param {Number} scalar The scalar to multiply with.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.multiplyByScalar = function (cartesian, scalar, result) {

  result.x = cartesian.x * scalar;
  result.y = cartesian.y * scalar;
  return result;
};

/**
 * Divides the provided Cartesian componentwise by the provided scalar.
 *
 * @param {Cartesian2} cartesian The Cartesian to be divided.
 * @param {Number} scalar The scalar to divide by.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.divideByScalar = function (cartesian, scalar, result) {

  result.x = cartesian.x / scalar;
  result.y = cartesian.y / scalar;
  return result;
};

/**
 * Negates the provided Cartesian.
 *
 * @param {Cartesian2} cartesian The Cartesian to be negated.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.negate = function (cartesian, result) {

  result.x = -cartesian.x;
  result.y = -cartesian.y;
  return result;
};

/**
 * Computes the absolute value of the provided Cartesian.
 *
 * @param {Cartesian2} cartesian The Cartesian whose absolute value is to be computed.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.abs = function (cartesian, result) {

  result.x = Math.abs(cartesian.x);
  result.y = Math.abs(cartesian.y);
  return result;
};

const lerpScratch = new Cartesian2();
/**
 * Computes the linear interpolation or extrapolation at t using the provided cartesians.
 *
 * @param {Cartesian2} start The value corresponding to t at 0.0.
 * @param {Cartesian2} end The value corresponding to t at 1.0.
 * @param {Number} t The point along t at which to interpolate.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter.
 */
Cartesian2.lerp = function (start, end, t, result) {

  Cartesian2.multiplyByScalar(end, t, lerpScratch);
  result = Cartesian2.multiplyByScalar(start, 1.0 - t, result);
  return Cartesian2.add(lerpScratch, result, result);
};

const angleBetweenScratch = new Cartesian2();
const angleBetweenScratch2 = new Cartesian2();
/**
 * Returns the angle, in radians, between the provided Cartesians.
 *
 * @param {Cartesian2} left The first Cartesian.
 * @param {Cartesian2} right The second Cartesian.
 * @returns {Number} The angle between the Cartesians.
 */
Cartesian2.angleBetween = function (left, right) {

  Cartesian2.normalize(left, angleBetweenScratch);
  Cartesian2.normalize(right, angleBetweenScratch2);
  return CesiumMath.acosClamped(
    Cartesian2.dot(angleBetweenScratch, angleBetweenScratch2)
  );
};

const mostOrthogonalAxisScratch = new Cartesian2();
/**
 * Returns the axis that is most orthogonal to the provided Cartesian.
 *
 * @param {Cartesian2} cartesian The Cartesian on which to find the most orthogonal axis.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The most orthogonal axis.
 */
Cartesian2.mostOrthogonalAxis = function (cartesian, result) {

  const f = Cartesian2.normalize(cartesian, mostOrthogonalAxisScratch);
  Cartesian2.abs(f, f);

  if (f.x <= f.y) {
    result = Cartesian2.clone(Cartesian2.UNIT_X, result);
  } else {
    result = Cartesian2.clone(Cartesian2.UNIT_Y, result);
  }

  return result;
};

/**
 * Compares the provided Cartesians componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Cartesian2} [left] The first Cartesian.
 * @param {Cartesian2} [right] The second Cartesian.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
Cartesian2.equals = function (left, right) {
  return (
    left === right ||
    (defined(left) &&
      defined(right) &&
      left.x === right.x &&
      left.y === right.y)
  );
};

/**
 * @private
 */
Cartesian2.equalsArray = function (cartesian, array, offset) {
  return cartesian.x === array[offset] && cartesian.y === array[offset + 1];
};

/**
 * Compares the provided Cartesians componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {Cartesian2} [left] The first Cartesian.
 * @param {Cartesian2} [right] The second Cartesian.
 * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
 */
Cartesian2.equalsEpsilon = function (
  left,
  right,
  relativeEpsilon,
  absoluteEpsilon
) {
  return (
    left === right ||
    (defined(left) &&
      defined(right) &&
      CesiumMath.equalsEpsilon(
        left.x,
        right.x,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        left.y,
        right.y,
        relativeEpsilon,
        absoluteEpsilon
      ))
  );
};

}





/**
 * An immutable Cartesian2 instance initialized to (0.0, 0.0).
 *
 * @type {Cartesian2}
 * @constant
 */
Cartesian2.ZERO = Object.freeze(new Cartesian2(0.0, 0.0));

/**
 * An immutable Cartesian2 instance initialized to (1.0, 1.0).
 *
 * @type {Cartesian2}
 * @constant
 */
Cartesian2.ONE = Object.freeze(new Cartesian2(1.0, 1.0));

/**
 * An immutable Cartesian2 instance initialized to (1.0, 0.0).
 *
 * @type {Cartesian2}
 * @constant
 */
Cartesian2.UNIT_X = Object.freeze(new Cartesian2(1.0, 0.0));

/**
 * An immutable Cartesian2 instance initialized to (0.0, 1.0).
 *
 * @type {Cartesian2}
 * @constant
 */
Cartesian2.UNIT_Y = Object.freeze(new Cartesian2(0.0, 1.0));

/**
 * Duplicates this Cartesian2 instance.
 *
 * @param {Cartesian2} [result] The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
 */
Cartesian2.prototype.clone = function (result) {
  return Cartesian2.clone(this, result);
};

/**
 * Compares this Cartesian against the provided Cartesian componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Cartesian2} [right] The right hand side Cartesian.
 * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
 */
Cartesian2.prototype.equals = function (right) {
  return Cartesian2.equals(this, right);
};

/**
 * Compares this Cartesian against the provided Cartesian componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {Cartesian2} [right] The right hand side Cartesian.
 * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
 */
Cartesian2.prototype.equalsEpsilon = function (
  right,
  relativeEpsilon,
  absoluteEpsilon
) {
  return Cartesian2.equalsEpsilon(
    this,
    right,
    relativeEpsilon,
    absoluteEpsilon
  );
};

/**
 * Creates a string representing this Cartesian in the format '(x, y)'.
 *
 * @returns {String} A string representing the provided Cartesian in the format '(x, y)'.
 */
Cartesian2.prototype.toString = function () {
  return `(${this.x}, ${this.y})`;
};
export default Cartesian2;
