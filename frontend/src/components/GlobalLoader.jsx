import { ThreeDots } from 'react-loader-spinner';

const GlobalLoader = ({ size = 60, color = "#3b82f6" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <ThreeDots
        height={size}
        width={size}
        radius={9}
        color={color}
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  )
}
export default GlobalLoader