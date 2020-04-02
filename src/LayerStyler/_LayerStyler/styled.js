import styled from 'styled-components'

/** @component */
export const ButtonContainer = styled.div`
  padding: 2px 16px;
  margin-top: 10px;
  display: flex;
`

/** @component */
export const Button = styled.div`
  user-select: none;
  display: inline-block;
  color: #152357;
  cursor: pointer;
  width: 25%;
  font-size: 12px;
`

/** @component */
export const StyleGroupHeading = styled.span`
  font-weight: 500;
  color: #6f6f6f;
  line-height: 32px;
`

/** @component */
export const AddNew = styled.div`
  display: inline-block;
  margin: 0 10px;
  color: #152357;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #054d94;
  }
`

export const ResetText = styled.div`
  display: inline;
  font-weight: 400;
  font-size: 12px;
  padding-left: 15px;
  color: #152357;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #054d94;
  }
`

/** @component */
export const Half = styled.div`
  flex: 1;
`

/** @component */
export const CollapseText = styled.div`
  flex: 1;
  text-align: right;
  line-height: 32px;
`

/** @component */
export const Fourth = styled.div`
  display: inline-block;
  width: 25%;
  vertical-align: top;
`

/** @component */
export const Text = styled.div`
  color: #939393;
  margin: auto;
  margin-top: 40px;
  text-align: center;
  font-size: 16px;
`

/** @component */
export const NewStyleGroupContainer = styled.div`
  display: flex;
  margin: 5px;
`

/** @component */
export const NewStyleGroupIcon = styled.i`
  padding: 0 10px 0 0;
`

/** @component */
export const NewStyleGroupButton = styled.div`
  flex: 1;
  margin: 0 5px;
  background: #f0f0f0;
  border-radius: 10px;
  padding: 12px 8px;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  text-align: center;
  color: #505050;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: #d8d8d8;
  }
`
