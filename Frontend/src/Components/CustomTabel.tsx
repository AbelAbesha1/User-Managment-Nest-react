
import {Table} from 'antd'
const CustomTabel = ({ columns, dataSource }) => {
    return (
        <div className="overflow-x-auto">
          <Table className="table-auto w-full bg-white border-collapse" columns={columns} dataSource={dataSource} size="middle" />
        </div>
      );
}

export default CustomTabel
