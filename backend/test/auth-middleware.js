const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/auth');

describe('Auth middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should yield a userId after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer azerty';
      },
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'azerty';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
