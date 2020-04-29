module.exports = {
  'presets': [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  'plugins': [
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['inline-react-svg'],
    ['module-resolver', {
      'root': [
        'src/'
      ]
    }]
  ]
}
