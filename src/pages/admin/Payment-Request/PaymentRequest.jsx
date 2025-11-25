import { Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import PaymentRequestTable from './component/PaymentRequestTable';
import { changeWalletRequestStatus, getWalletRequest, settleWalletRequest } from '../../../services/admin/apiWallet';
import { useParams } from 'react-router';

function PaymentRequest() {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const { type } = useParams();

  useEffect(() => { fetchWalletRequest(type) }, [type])

  const fetchWalletRequest = async (type) => {
    setLoading(true);
    try {
      const res = await getWalletRequest(type);
      setDataSource(res.wallet_request);
    } catch (error) {
      message.error("Something went wrong in wallet request");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (record, status) => {
    try {
      const res = await changeWalletRequestStatus({ record, status });
      fetchWalletRequest(type)
      message.success(res.message)
      // console.log(res)
    } catch (error) {
      message.error("Something went wrong in wallet request");
    }
  }

  const settleRequest = async (record, type) => {
    console.log(type)
    try {
      const res = await settleWalletRequest(record, type);
      fetchWalletRequest(type)
      message.success(res.message)
      // console.log(res)
    } catch (error) {
      message.error("Something went wrong in wallet request");
    }
  }

  const confirmAndChangeStatus = (record, status) => {
    Modal.confirm({
      title: `Mark request as ${status}?`,
      content: `Do you really want to settle ₹ ${record.amount_requested} for ${record.vendorId?.name || record.driverId?.name}?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => changeStatus(record, status),
    })
  }

  const confirmAndSettle = (record) => {
    Modal.confirm({
      title: 'Settle Wallet Request',
      content: `Do you really want to settle ₹ ${record.amount_requested} for ${record.vendorId?.name || record.driverId?.name}?`,
      okText: 'Settle',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: () => settleRequest(record, type),
    })
  }

  return (
    <>
      <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between '>
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            maxWidth: 300,
            borderRadius: '6px'
          }}
          size="large"
        />
      </div>
      <PaymentRequestTable data={dataSource} searchText={searchText} onSettle={confirmAndSettle} loading={loading} changeStatus={confirmAndChangeStatus} />
    </>
  )
}

export default PaymentRequest
