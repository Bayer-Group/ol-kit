// This is a Lambda@Edge function, for branch deploys, it runs everytime someone hits the demo site
// Followed this guide https://karen-kua.medium.com/how-to-host-multiple-react-apps-in-the-same-aws-s3-bucket-cloudfront-c518c2b38408
exports.handler = (event, context, callback) => {
  
    // Get the request object.
    const request = event.Records[0].cf.request
  
    let host = request.headers.host[0].value
    let s3Path = ''
    const path = request.uri.split('/')
  
  
    // if the user requests demo.ol-kit.com/branch/$BranchName then route to corresponding path in s3
    if (path[2] === 'branch'){
      s3Path = `/${path[2]}/${path[3]}` // slashes '/' at the end are not allowed, that's why we need think funky string interpolation
    }
    
  
    // Declare the website endpoint of your Custom Origin.
    const domain = "ol-kit.s3-website-us-east-1.amazonaws.com" //s3 website origin
    
    // Instruct to send the request to the S3 bucket, specifying for it to look for content within the sub-directory or at the root.
    // The key here is the 'path' property. It specifies the entry point.  It does not affect the request URI (eg. /login). 
    request.origin = {
      custom: {
        domainName: domain,
        port: 80,
        protocol: "http",
        path: s3Path,
        sslProtocols: ["TLSv1.1", "TLSv1.2"],
        readTimeout: 5,
        keepaliveTimeout: 5,
        customHeaders: {
          // Set a referer request header to gain access to read objects in the S3 bucket.
          referer : [{ key: "referer", value: `http://${host}/` }]
        }
      }
    }
  
    // Change the host in the request headers to match the S3 bucket's website endpoint.
    request.headers["host"] = [{ key: "host", value: domain }]
    callback(null, request)
  }