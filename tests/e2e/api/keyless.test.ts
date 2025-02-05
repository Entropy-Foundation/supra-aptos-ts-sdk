/* eslint-disable max-len */
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {
  Account,
  FederatedKeylessAccount,
  FederatedKeylessPublicKey,
  KeylessAccount,
  KeylessPublicKey,
  ProofFetchStatus,
} from "../../../src";
import { FUND_AMOUNT, TRANSFER_AMOUNT } from "../../unit/helper";
import { getAptosClient } from "../helper";
import { EPHEMERAL_KEY_PAIR, simpleCoinTransactionHeler as simpleCoinTransactionHelper } from "../transaction/helper";

export const TEST_JWT_TOKENS = [
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0wIiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.eHqJLdje0FRD3UPmSw8sFHRYe9lwqSydAMcfHcpxkFwew2OTy6bWFsLQTdJp-eCZPhNzlfBXwNxaAJZksCWFWkzCz2913a5b88XRT9Im7JBDtA1e1IBXrnfXG0MDpsVRAuRNzLWqDi_4Fl1OELvoEOK-Tl4cmIwOhBr943S-b14PRVhrQ1XBD5MXaHWcJyxMaEtZfu_xxCQ-jjR---iguD243Ze98JlcOIV8VmEBg3YiSyVdMDZ8cgRia0DI8DwFn7rIxaV2H5FXb9JcehLgNP82-gsfEGV0iAXuBk7ZvRzMVA-srE9JvxVOyq5UkYu0Ss9LjKzX0KVojl7Au_OxGA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xIiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.AS1NTZSzPf9Pzv-12mZ2ozKYf1XxlHGn58GpKpe9odFquQ9YHD3klnwN-dM93keSNL6K9MyPh33SBZ1mzWSRxhC2by_9qOf410QgmH27_CxJdy1w2oLaVMCL0JmQUB7IsMcrVr1SflV6hNeqDoRfGzwM4kl2ocutLoRcm2cm52s2aPBajb43qTIeuK3CoJwIS4tfU9LhiqofpQ_zeFpk4yv0YmYzoI8QT3cVQDxtli90g0_VtUtaIFiF63uJrGh0dpt8mISNGKccRnDEtb-DrdnEdGoQQFFLTwJQXG8dvcCPEkt1qbL7-iUZxW2h9oU4XnKK_1kxe63K2Lp0O3XbEg",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0yIiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.IGxHuaxvNZTpxIU1YgPmJ8nA85xj21JpYELpIxMQPeoeX1Jd9LkpNp71GkSacI9GGzDjRzCCyVlP31EEHO321VwJt2cBDBIKN75cthxM3wJAirL3IkcvF4cOGRmYoIwJo94U2qtIrV2hsUkAFrzQBQeG8kw-_f1h9dFZOJwJ21YJK0jsocsKWxm3cMjpLFm6lbVfGBlZDFQlAPctf6FvVrdzQx-L3bNFrVaXd_ONlBzxur1hZVIgzvcqdc1vk7hcITGEAOu5Kl2fA-WobIobVBgJsiLUUTqHQjQpW2hARZWKF41nvRQzExVBjb2V5DemgEz5WYIqj6MPvsQNQos1vQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0zIiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.pKTMY9nOVj3_XYCkLhrNIqXdxX5o5it8dtQQmmm8ct8utZJT1ILPtv7iXwLo8fMN4O8RQIfjqRC8DorQ1u7pwkrTB0yL4WsOGFBoeRrDes0cOrqv8ACqmcU3Xy0Gq_qyPNQ9lyOGOeaiW39GiybvxlxPVPvN4D_bL6JQTxjiqpkAWquXRtYu_IbmZ6Nlo_kNUX34vsd3xeeIKBNk06xBeMk0Euc5Cs5mipt7Vt8YeZG0EEHbmUFc4eG9-BKO4Zjsay7cXx8fCvKUXzdbGzPlWXVW-E4xoGJHFVmNfhbua2VJ6scz1GkWHUR-evnHlukPIAmmgMWcBlPfaqftDGMpew",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci00IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.OmHSYoRgP8i8BCT7IbM8U4VxEwtW68VMYOoUmMVdDpG3fPeupPVBr1EzdeJtB3B0gMiyD6W2mPVvcohSJJFNQFIGlUNP4e9ge2_b5fuC3bgI8UdAMKblt7FotYpkqGxeU-DEErioto5MXTzSi1UwQH4zmxQ1hDIOgYScNfO2LyHMueKz67FzDgIUm470AFLmc8TBrWVPXEyYWFdtpDO5yl_yplbQEXf0Z0tYpnHTwYgijnxAsNZ-_lX7CdorXSBZSXtpXHjwCl5WJv8cC65oxQLqVIsqwwdWzvtnZEHpLeERVt7NHyLHu7zfh1lohtZ6ulkKAr0Aot0r8BF0evy8mg",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci01IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.TbhkVpFaM3MTq1iAMNzI8ki0jX6PrtBmFkjASphGzlGdPBHVzwfbjTz0dEMXeKYAjggFJmhCinjsach5XYX0gQXIgIlb1xtde2xRxCe1SBZINmkCiJc7Bx19TXJnGNA74EBRwr6jEPGxhTMkrGRWXCedGKiuyc5Jg7znJTJ-pyc4cXV5YF6OWhQhx7voB9gotWECfnuumdx-AFq4C4Y3f3W30CvaqDBXNg0C9aRQvnDMTyQdbh82tJfMS59mrKUtOlloiyExtmKEyF0dr6io3JHN-Om8V5Wo72gDHTQWo4oqR3BfHXRzOcjPHZ34x6tj6nC9Kj3LHRmaZa-19nqvwA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci02IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.CVS5cqsXTFpkXBNxtk2ZDB2r6PeCpaT5MrqIBTulwx1p28dHZWe72Q0SdzRRc9oTWqk-u8yBYi_FY1v6A9YKGZHvXva80FmIWeOp4w4vnObOq_0TyDc6q-6_RO9h48WKy9fWlxhCFkTgzWbvBWKK2SsDDkQXRMTYO9PyIQgh40Npr5_S7p55kTanMroi7nAC-4zO5p_RnpwbUVxJwoECON5yJ_OiVI8PaGZCOiBErLB-rMxn88I7v3N4OCOMdom5WFNNM06dacFFy4JZ5JDrrL390BHEtZ0Q-lF0k8LzLpy3jIjSa0tnJOs5FTjgbT0wMGP8wpZPQE_1gPbCcyq7FQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci03IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.tps0gbu7xegBEMKRGOjltzhv0Ifg_35V1onFfxH4byxbmfOf0hkTbUqrLjFj9ZX31gIP6GRew68MQ6aqyvV4gEb5itnRTHXINVOfjCeFBxQvl94mgnMO5bE1bztSpYLYT6o90Jz6ZC-jwExu3MBFJHCLrSfZy-zdQe_5onkE4RnLsHuesMI7BxSCLHfSQdy7ZoRRx1yhhwTjB-JSQuugBP4j9hC5Ep7lfvIt3JPJoXFdY_JdlgtfQnHNACRTzeOLZEHA_u906OusBioql0ocmEwcCLtvecu7h3Z-IFIugja1kmocJYDhgyvVp2mbcdXlTlA7eb0KhCpEi__IBRPxUw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci04IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.FBTeSMj5nunVsZcL-poKbcdrEBDfZpEkoPjg87fOHkrFIrQUHWX6SFpUxoY_t-OwJ7cAb85655ytGPGm4kIFKqJru8DMXwt6M5KG9ir8p8FXLsw-z2KJ7COaEItqnEIS4EHC_HTveluLdV66yZ4DfXEakFyZVhX89Ys3KQe_xMl73c2hPBQQHwieZJeuqkA2zEFhqlr-pLmqFeZm9onHITc4XIl_uFKw-F7zfUvxz5ix7pjjltVylxtjpjuW8Z29kC8PjoaneaJamuA8a8mjwZXOI7mg6c8EuLTCdmZfBZto183qHtmlaKm_1LCky80dfRAY3lSZw_9E8QseBscVfQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci05IiwiZW1haWwiOiJ0ZXN0QGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzI1NDc1MTEyLCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiNzA5NTI0MjMzMzk2NDQ1NzI2NzkzNDcyMzc2ODA4MDMwMzMyNDQ2MjgyMTE5MTc1NjQwOTQ1MDA5OTUxOTc4MTA1MTkxMDE4NzExOCJ9.B3CubAPmu51Ysl7nlhYmGnzgJKjcF6H5A7D5pgjXCXvX7FWA7fwvar0y7TdSj7VSR45TLS5qLd0Iro9zfk_7rhRtNiRQYH5_SyOljCQCiIHs8FHCjZJlcCAqLILQbPinwFXe_LlSMekwAzgXd0ugPyPjSSwI32jkIkGHmif1zAfgWPw6FE6B3x4L_SMWublc4kOBsiGB4zQ2MiMlLK4alVoOatIVOJIC9Q2rGwDR-Pny4xIym6Z96Z1wZR_612RlUs52LSaHnCJn972fm1xhNMqlLhD_6BPP0U0vkrXfGI7PezfIEXDB2X6KLPgnasJcmvMWaPg7Hsrni4kapzGM2g",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xMCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.DqWxLChrjRx8oAAqmpaLdBia7td6KFnS3lcrZl4lglPUZG3PE6rOoNXHR0ldxOA8lARZ52eO-Ar7r8ElLp-aqHuU8CTjt_zWF8-w-BustE6Akdq6o_4Nbmd1fZuaU6qqgEMhtQU9MQhoKCkHom-KwDnlj9JXnDksppkQIjlxwxH2KSs3lSOCydZzS-YdWp9yeerMi9Boq3JqHe-yScUm-HgMIOfQWlDqTo7O9T-3xjboFbZ70xBjKA4qxolp3GA7ciILbe58MCK_cXbFswSDujFZhmujGcWDZ-jNDAKJvDICNYTIVlrgEY79N18ixfPVYykMakLtm_zoTCXu5VFQnQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xMSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.C2x-69mc-7OlDTy7cvjqqIy4BDkpysdEFudWbNvlDKBV6xzGNeBJu4suvMIGQ_OSz0s2fI1BDm4gzxgrSPLYBdnO4rAGOkboW6sgrYzVHYl56t-WPDY0w0vxjHx2fS7sl6W3OnrKNLOOThhHQRtF3zWt2B4yp-IgF-RZufeVnQJ6u5xZmSJGUeZIpt_LKiLP22vPXHWHu73MIFrjIC9JRi2gHiYt-3aXeHZ3f1OP7tfbGod8zS0-ObIpdxUF9LU8Py_UjgFzrGuJc9LCrGgoHfdP-qNwpQCsn6yEkT2eK4eD6FQwjiTZ8sD1a91JBs6AFjCo9VY8WobQgcx1mKb3SQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xMiIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.DdBNljIxQ3kQC3uN34p5cq6GBM_u4UaVpMeB52DEA6BKJYP3kICDyk3pOWyb0dH87fXrbXA_jvxwlvH24kTusba28kVjwJKK2Jia7zGdTym07JZ8JkQwnFse-n5iuy3Hq9P_EUow3U5LkcBl1E0bQY4s08GCbDVImJQOfZmqnroGO8Bjoj3iOdTm9v_Pg9OTJQsZbJ7SNRdRkxH9BFe2i1lY1DXo9c-w85iTPsh6ZxFtSUx1aFtCUmwC-3bvG76zo8HHJzE5_1QV7Lov90yXMDJWTgNrJwxgUc0NarYE1SN9LqOhY4oUJPtDw2_erqFC2aWktwYg6ZtwB-QLKuYuIw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xMyIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.VybD_NpPN9k1YoP0pr-EBSzJh2cRTOjY8BiAagfMTAi0nWxN5IBsdggtUU8n8JTRs5fBoJzDU8CVER5rfPw0lVkSQDOc9FChsWkIj1V3920l8jzFDhPH3N-Fqmx5FWPVQqKmSemzJf0QP8liRo7QhPsjTdMlmhGuTHh3eEBaESnHaXuQt1TxFNsje5oRIp_4m1eJyGA4T_ySbmzwS0xj-LNZR-zZinTNcU1YzOZJeU3kolntoMfZtncxU7vBeomgN-STfRYhZKSEf5i4kWyz97x2K1NxaeyFt4X6RKRi8XKox1G-jTWccWNLNvk0vlj7Fe-02SSN5R9KeZDCvsST-A",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xNCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.ifgg8rjh_uClJAKUTEWIrkdZ3LNv8h1wR1YrRxx0VDPz6i-pq77BtC311gFAJDsMR5X2MDHAnbpxea4CxoRABKZV_et3erCyhNLCapWv-QgYjyvuGhFVQ9jzECs8k-FcTLRwYOZD85eOmpi7bBHCfd75kckdYjt82MjToMrY37dyFkSpu7XhcqMvyfpRSu6G4mwYtc9Wg_PJ1tDgxcyqhk2fh7MFZ4mlxbbHA90wR4-rdp57_Q9yVjNNetnQ3z90Uj7aFknEb256g0dkRORf7cjRqR20KuA6mRm7Yji7YlL1rBXPa_0OFmNl494fovQG07YWChSc6xmnNeDJUfQXvA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xNSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.OQjh3upJbNjFPB85okrYl9v1-HAT0enr7i2UVc9tT0o489AZiTyLEWaoXXrdu0sx5nAqrt4FMdo1wxSn4UZbWs1TV2W5vz2EKDMLYxYnGlRriaoC98tWTUjCjowXsyhrmJOnedkl5pWyYn32vaXUT5Pb4RbapXw1EBV_wKkGdvjAWaOZs7yhZAycGVNJI90gHRG5hT009gr4jsi2nZU6MnaRtmRSzUS-J3Ky7yFX3rn2PnQ-_wOzQhy2a67doLTmCK5Wr0xj0PsNa2f5nYwwcxAmXMNdiUFYw85zyXwR-rGCvBGDZeZ21oFwlfjTcCJWGbOnXlUniHanpKOh4UkwPA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xNiIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.ToOnqSm2FMWOO1dIFEcJIhwb2HGUKWycwS_HRZ4Xa8BJy6KZWYI1Eo9kkvsOG-E_ZrlB6T7QzaYk2r3tEFzw6vXEFy5AbynRMh5wQjlE5YdlGMh2DHymgvYucWrVTTq2HZheifMv4rJUsNzKgtfJdk0u0kqKnel3RP9EP_8xpdWM6NdeQaLQ9uyHBQVYh_jqm_Pw7q9McMpUP2zea7pUIf8ZnOapNFekYVUWKDL-kwRfM23DJ0RzE_8PTGqbslRZMMFFxF4lRXR1kAtRKYqxw9tWlALTLNRNJz2V_puBp3UTJ0szNfr9J4x7iwkF-CPPYK4vGmDtSwxLW_7Et8n8KQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xNyIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.DsuzT_799TsJLSR0D0HR9ozpiRMb-_Xm_5pTRbZ91AR6hlypvCnD_gM6bjcz_te8v8EoAYfrJkQPNmETTro_wzXzfxyFmP42ml2bPhtIM5Lpfa0nwHOIMiOnW9F3nsIaZcBL3WJG_h46RyIwaOfoDIAz2320Dn_N-wgoUOQbvC8lnpWf2w8FjkqcO2AWhpE6P6tZYGCgKyW8mJKgEv1WrrCNM37iqwkaMv2Mdk3ghERa8Mu-WEJcuOoZ0hSoy0SoLJIJjMja8SfMw27wZsPMQqwlCp-mNbBfbBa_EkLmVcVYZoPL6X6MF_gk2rCnZaqh54-lHEJCPMV0P0_T06N2tQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xOCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.sQjWTpenq4VJPq3kvCcJIIbTcZvOT64AgZ7yEMNHM2Nx5RHARzvnqfGwUOxEHzO0bwKNzEvVJR86D2QQnoUOPXK0QdeZuI1olhVof4i1gq3VeL9xi94mWSEgjnZorJCBma5I5djq2cbnIuMTCpHmvgLLIqZyZFJydcaBY9gQAFaFkD2DWfz3J38E-guuRwjV0G76gfiAU7mRNEkT1cZX57HxABJzrEMmri5wmY7dfErdwuqU5hLBzJiD5jPMy9QiZ_xjVnkSZ8NEtOXQjT9i69MHdnpnKxVSAqoMBHdplJgvNixgUnX3zoecHVlxPQInYNvATgtMMlSLOX1euKUykw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3MtZGFwcCIsInN1YiI6InRlc3QtdXNlci0xOSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.elbm8TQ1qHbxKmTPq0ShHiRNiqZ_bF_GG25Gjeb4JliYz4PTrxtocXX4Frez_4nf7mCbgcB37fkuJrcyHQ5QaCxjWrVzqUzgMWnRt2ryMnj4tN9Oz4O3Yidoqkxz726iJ7X1FnRgNaG4OGLUItLfYDKTBbuSKzdHyGA5zsBEKVmz0FKL9HdD66D44alUddg1MUAbphxBG4ghh0mZg8DjsXCCsxO547xvgScK-tGt3_I8wEyS-D_-bEElaLPnW87wFoLosHIZucf38PdadWxk6gSt3MRdErLHeP42DwsVwv7vF2b1aTek5au-f-FUXTkidyEfKKuHtmIS3ZKltyJ1Pw",
];

export const TEST_FEDERATED_JWT_TOKENS = [
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.fZPN9kj5H1xf7YS81Rll_3-BC1yOIngoAmr4rFdvMtLqRxNPfLncyUFjsTfsf5USh-LwjQli8fb6uDSmnueGCbQQyw5CDSaALFmSMqzzr_ZezQv8Bv7iXrLPKei9Xp0eogoYsbb3_2PEu8DxwjXAD285uj5QPx0cTaoo--yf80rvvQYbHJp62XEd82mpM0vvaZqF6T_33STfj06Yj8B0RhAfKTSCTCa_7njriykbxIN7O5b_xPnhkRSJIjqD0ZmvNex4MuxMaHgd6Zgs9OIymzYh5dgsrC4Z0OawXCjK56N7SdaXwE6iFRF1g6Yy0pFxhMsX6_KtZR3-xzDndUvxwg",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.N7s0TZyE6bRjxWPGIlpjVb9c0jI_5dWgJsdWyYj6WQ1FEK4zb4b6nmCjHAJ-3dVrU9vJkOZruWqnpk-c7KcbS4Ouq4TzQj6FMbE4DBDvG0GF_TDvw5-Wbs_KU7dWcStqvDaq1ugzs2ZVnYlIp_p-VfK1kTY-N-4-nk2Xmv62mStF5ShORBUOraKmrWuwC6gnYC6-srZbvufdN-9GOXqMNiJMHonrEM66qDjsSCl44_lmj91ze5GzLKv0ggCNc-ZVm5Tj4fmre6Ba6RUxNi9xUHrzNoEZHg-Y1ZlNXgfozw3pkSrA5CDp5xonjVFfHQR_J_sXHKozk_9K3dNkOeBA5Q",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMiIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.fLiHkTWpSR-ux61nlRLBIGE8XDYP23DE1h9VJpb3CXX-LYj3A9B7YvvLRXUZ4Ffl3DLV97GsT_tHEEB71VHiJ56xpwxUWxkHdgWgxFLaWgtuW4kBvydIvyMOWbYIoeO2Np6Ef1q58VjY5xs8RAMSFHhY6VDJ0vTZn1hgw01Qf041boIFNjIYvxSvLtA0-B99uq0mI2TOquLBjG-N57mnukW6oLSWUNOC1ysmrWavYIklTJxTShOpufNzB-oH3zD7O_INSWnboyIabGz8TC2njMd4mub4KwlyZJZ00zyHs5sMLG1W6M0V8RHrPIas1G4ic0drvHRlkiLLDlCcEZkYbg",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMyIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.Ccm2d37bJ1GGaodtzztPWlmp_Aa8XdrvtIpB84JPjJKlijIwvRiENC9p_9EwinpTEAZqyJHDniHw1mn29p1tXjoA1rGwj0YmcbtS3oYdXgiva8leuPzAUfRmwIxateIjIoY6ggYVctPLa_yIomVPhB8TBS2sGq0kTA_VAiQ2MnU8RuPJyXhl_bE27DbVLzTaESDIN56SO7Hwz5EwsSNzt8hiFKScppRpzUEEQ2EIIUkGePpnVxNtGAmi7DXVvd17AoYADnjQZCelpQcBE6_WUMc1_9MHUFVTJwTdf3lPYIlGAXCqmHNvaz1sUf7gzrkZCub2BYzhq8zg458EvG8E6g",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItNCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.aMFGHKNeIHkBE8woc-jiTFAB1sm7RE0sCxQcNKkiaak7zCXbUrdKtImhht9yx_VmJ8e2FubH8eVh92P8tlIGaTpwdtu5qq8i71l7nX3Qk2DFxUAbAkG92suTnzCQE91D5Rtt8dlvmwHytx-a7Dr0Gv4M1JPon1y5vSkBrSsLIqiK6CA9othikadZRVUwO0ubckNldlhPjE7wz59Qf9Q3UNFFcIFVaGM5BsLIpMiZZOwEuNqitD243kPXR3gBBmPwYygMV_HtpSA8IXl95Aojg4KftZFJG7cZkLd-g_tz5KW-4YptrB7-3URK4K4IwNQJ9XUHbzDrMcYaY534YCVoVw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItNSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.HZFhdvodQLF3fGH9u6beqWsfugFS1OHkZMMhkTWRVhbzREs5g91_GzJcchXetotbhBmcCuQ_apLFFwOWHyx0VFTm2WvJdd1uUYrn4sKllFok9709ZLOfBlbo4218C-xA8LEIBoz6AxXfm8CVIy3FFjUGaKkniWjCdofWa6bSkxCXqMrGk84IaQP96S_d52ooG_B3H-Gb9mbEYRgBP3zEgVEq0bqMiJQJ-CNPBIeKAkUp189kOS3EHhheggNPbR8g3ee0AtNXlHbDDWdIQFb223ufFuX6igA5aWoIUFIBZ-URx0oy099ua8Pem5GuB-rzaC6BN14AabsqCievoGh8Yw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItNiIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.WoFAo8QOdYU5TWFxFo01n1ZfJaMlhbMb5cq82x0YvlBnA39ureqQ4f5kiB5Y0fMzqhJsfzVUq3lZBmCK5xYkhUUM-IoYhxW0R1efe7Hb1I1rD4OLwntxECSEvuftTqOYPDQRzatI1JORMrWYmRYsPlkgyrlnpq7GkVVd_gjlrTPKwMNTBxc6oXjgkjl7MqAir0KIo0gii-Yb_ApXHP17QpMjL5mVgqjYLDY3p5FeKRV3N6UyMCcIyWKDRs1qkeskhku-b52t-CU1jiaYtfzRI_bG_IMJjInT4QpFmaRr3sYS2sz1fX8oXSWxAxgbgc4nYqlAHJ5r6v-UYdBVGCA7yA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItNyIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.Nz9PusTXc77ql77jZwMaA5qM69k38kRa7R9fKMIjpQ_ZFCyGa-d43cy6z0iqkjox9MAooNc1iE14aYAa-kFYGl8HREbmRD8o7pM4QaUi7J29jJcQ5xSTQQPH2skgQ3Yp32KsAFP1KvLtl2k9IGB5D-4uinpjxcfjFP55Xv50IkHLS4l3HoxBKpg7UzcFTfZ8hVsHwH7Z34LEb5HG7ZP-68gCTQjlDocZu5fXKOOZSVyQYQQ7cHni_y6c7YmWueDCCmZAbR1eqL9ttVGEmj5hzXDqsKPZuAlLf-nZgsIv3o3970D6mcgqdDy5qaRRm2Ch6Y9E2Z7pdNRImN-nY1mH6Q",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItOCIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.f1XRod-ZDlUcbkxAfgKZzSUTs9TuObPw0_K4EE9SsNUf9cDz976E3StiqNqtbuT5kWt_eb8sUsy82hlr0aZD5vMwlyM6J_SSp_lqsxZAKgmLdB07-YO0acdx0ElRNrFjVH8JlDKrPPhke83f4FU4lWN6EEnx6JqcNkh2YEA9r1FektH-54nc1ucjfBZwIgwC3PAex0mfYLq8E9g-cWNPlAZhVCcqdK0q0WfD4PBDrmUBREPYoAsZI6vmBx08m3OuhUJYTCTd4EFijlZcY8vdIxzXwe7VsZm3GeavzlsOpPjMoyPk06VvQtqvTlEm_yvTcjVrVXmWwkFr_v1-Mu_dZg",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItOSIsImVtYWlsIjoidGVzdEBhcHRvc2xhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyNTQ3NTExMiwiZXhwIjoyNzAwMDAwMDAwLCJub25jZSI6IjcwOTUyNDIzMzM5NjQ0NTcyNjc5MzQ3MjM3NjgwODAzMDMzMjQ0NjI4MjExOTE3NTY0MDk0NTAwOTk1MTk3ODEwNTE5MTAxODcxMTgifQ.nNETD85nln2HOqbJ1rQZ9keQM9TAwRJ0qqnUY_srBubPScowk9MxibHtUM8paDTKviGJY8G4GxCIb4A-Pk6CdgmbfRAyx8DMVf0Z-I_bfrVp64ZDU090fuZv7-uU0QgZYSvOMOibBz1oun-Ybuv5hqmruVq4OHmWcoB8fjofaV1GOauk7L4tAJ7nhCrBuZuPbBLCTMwYz7-0cLjPQ0L6bk9WcIW355Xu5w8hTuq-5ccI2zMyaFUmGA81-V5sVl_HTaX3x8X5JBi6JRL55De-BqQ8-TzJW44i2WU-gC9p6SeHnPXdQESjf8YdRmSumnupk5aoMOtYr2OVdzFM0O06SQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTAiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.i_awHcWeU39k9no2klEajvTevA95naoquvzKu2DrS9lS_7Fm52pezCSb2e3M1ovvkoITpTb5IfRCo2PrP8AuGUv2srZU3GqDoyZaMYguvKJLLeqV670i4knGFWqfUegAJh1VB_-yN4nlbV9SXG7D7yk0WwWEUUGfWB7_NGqsHX2B84f_U_Dus14x7za7Y1t91EeXhzwCgZJMB0DfXT2Y3VUTU1O1abUKJ866V5pdQC7HJv2qUthmn-TlSIl6qac5dQQ14YxQtyEKXeTP74guxArcdvCsPuC8TAAnP_f_NxehFRRSQ-HJ3tJ5ym7PwQ4L1uaW5Rxc7duqsrk1JdX-zA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTEiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.Z_5NEdbvnP9kqsCrOPIqCrR8iYX9kCIFsCMFiU9ozmkNjCDHgU5XQKuYRfsi7Mfq1CQL7gZVtJsDXWmv6ENBRJFFu9BHORuTZrMZi-on5yVZVf4J1RaxcRAdFOCIznN6DT6DyAFxq0vyCutUI76BtmYr17g-SUrESUkgG4jgL0xIcMNcitKWQ35o8fYJWeaTAa2x3SbX1IgCAFdjsD6DLm-LY5t7MicHekrpkHDBv_PuP9xzxRbNJfGnNnnB41h9sfATqiIMJXLvUfuDKmN43MQAowODTtgDfnuLNwBuXkGOCLQmtLjdNYqLRGHccFwEsanfUimOCmsjRMvJSt1o7A",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTIiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.Yq69UbPUVLTG6IMnqwiqf-sMnm42JMdTfOIv-8bjQfIPRQauofFeqEYY5ls6i41DbU9dLkMofoOshm04NI2zk0W3lE-6USak4Tq2xnnWYsPuWlXV7P1w7f6_KwPD8BYnGiWw5DTZVG4tjn3El9D8lPikkWlEAE0Z-aR1p3ezwzqIoRokeN4A7uxvcAzTWSqYQ-JkF_GAMbnLScfjXVEpCjiDnF-ydW3Aj6B87S8K_EWOKptFpswS1UVCuwVDm1wGouvK9WbBSAdtZhdl95p_geke_l53z3PZdjYMYrmtTSxJdBAL-iJ-UpODqzz8sh9rGXBv70wM14oW19IboX9q7g",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTMiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.ZT_zGYMcj4hyzIAyqE3VAte_pxiPxF1cnUBpgcSl7NCIRCO3ErpmsXlvas438UO03tj8mqpyuwFuTEHjSAVZRSU_rOgGowtTnwBRBJJH3pFzvv3JE3mnRro_7nQWXRZqYzmUNAxzEEhn5fJQGyYXilT7Rc-5E9CHtcjxnpN-4eC9oNfQiw4hOG5nzx54PxQwirlLfS0l0zc4-qRmS31vNJBKIULD_6y0MUrr94dZk-M6fBGqGVuCLgMfh3jlCFgMjpE5BBBCvoodRu5mJ8aNWa6DgqHUlc3LXqL_Q9IezFS4KIP2KYASe10sRVRs16_dZXy_ng5Ny9shzNRKMZiNCw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTQiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.PDY8M4wnfh1gQ-DLnozLekWRCIJAL6y-8ceK7tlrFcLaoiNfnP2pPfgY-cUKAV7hEkKAt89PTUXOa_d0JUmjh0XkZUn28KqXK229Mnp-wUE114GD-Bu1rlQLQoJ5m_sWWLBEV4_FlKx0igyJSWb0YYYl5BfgxDGoyCnQTfXXC4Ha6OJQo88qcQD_K-PRmZ558fhAWrRJaeukegbXpGfw6Hhyw4z73GhYvEiupXuGB34UiWxWsTHyH9EzY61wIQQLGs0qjXMa2QMDEnApqWYnVWcug86IHz5JX5fxxmVz9qzMufc-WArplFnD5LLulZdg9zQdXODcyEyRZbtuBfEcdw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTUiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.cVzffagURHwPU-5c-NYAKoPF9_43d74ashqvCOzbWGL7PyQY_mNZs-2oev_QHXyrjl4PkmCvviiaawTKyQP9gWFFVfnyQYicP8M1gCvVUKenPYLpzYAp8SEUCISyKkDE3qPc73pf2FQZDl6815edBKiVaIoomdoJs_7QE28Ipo4d8D1g61cetE5sc_JMYDWg_PpeTdB5vBPuPKzr8Mc1zz9u8AJhLn8c-XaDDubhvwj36xsgVY3nw61FQxW9SBwLoTmoTakV57SP49Z2glzMrY5hsfrXyWynkJQadg-ZiJbpoqXfrXINdGr7y9Iboh2g18D7Cu3vlFpv_PQx6cYJZQ",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTYiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.WEDo0H753toeCM9OnbeTL5ofJAAmjv7crP9FHrGA_YcPRnfMdmnjpa3cI4olloSDI2j69BGOK05CEjumCXjz-YPoZDgiEuJtDSEZA-1CRUXTMvbERjK47o2X82T_iVLRBVihDEbmyxAnCnwPNLTGMMr2-2o2RCzlHhOTryih-7CNj6ty9HMlOmlIA12FWj5Ik8G0BdDaWhBClaGh9UYiDKXWUvBLFVD_p8FA-GJ6D9ivwj10HIMHnYxCNxDMxBYytS0Kr64AJ6Pe5Chrhq2u-XlrnVDJVWmgoMlsoMAZ2EVzVOU_s_cHK_7QIaySaSTEO-rkdhFMulqYMHDc9JWkpA",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTciLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.WtLlWEKtNeI2HmYdIJam_bWLGxvOVTSj4ohxJuB1NBfSZxQbuAgQ3_pnXVd7uioQyUm5JEloG4FkJFYE7hmrlL5ocCqufws40HQJQx2bJm_8dePccMNRyjsk7Ya7_1dp0d5QEH-Ckob_MxIAawHqhMUGTExVXuk83STXCVN3e9HHzo7UiekuYIaAbSlBpX_ySkfAPDHvkKpXwg25w9zI3y0JrVGwoKlGNzwasFiY0RVtLNLQPpjz_LEdH9xappg36M75SP-q0lJO5KaWtmNHHTTQ11GXs3xXwMCn9mU6kk_sBy3N_GVtkSP_qjCAdHYKUPhx4Pe1Xajb_trvvCCk9g",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTgiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.CFK5gunymQ7Jf7stOsWdEVO1y275eSefL0LsQku-Gdn_iWVFmzY_ASQqBJt8jmfM17zht5NUrASm095yn3vDRYnx-CgtDwJrpF3jeLbt101ld8VytJxng4CjyznzrVuSPLM4DMiUjILG4vd9wNOkEUgPQzu5qdqEGckxj-c1lMpWhyWDR9pZaX_BryNGNdQvw4auJFuHcWl4HeVLYhdcZulbz_OAq1huYZgrjzDgVrMjXOxo2SF6ObmnJzrRllrynwingLAsGQtiNWppVNcpeG-DxFhWYhnb_w-oTk2HcwFoecWr0R_ran_UY1n0aPZ_2MzZ_NsIaeG0VyIk0SxbHw",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0LmZlZGVyYXRlZC5vaWRjLnByb3ZpZGVyIiwiYXVkIjoidGVzdC1rZXlsZXNzLWRhcHAiLCJzdWIiOiJ0ZXN0LXVzZXItMTkiLCJlbWFpbCI6InRlc3RAYXB0b3NsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MjU0NzUxMTIsImV4cCI6MjcwMDAwMDAwMCwibm9uY2UiOiI3MDk1MjQyMzMzOTY0NDU3MjY3OTM0NzIzNzY4MDgwMzAzMzI0NDYyODIxMTkxNzU2NDA5NDUwMDk5NTE5NzgxMDUxOTEwMTg3MTE4In0.cOZY1MKhMYDv6GNAI61ojFKtZS6M1a_5eOkuVVVFk1aEpvMqe12irXy8WZOxSauIcZvy9CazXPZprkEhnGIExV4LFzbelG4T2DP7cvO9zmJXb481p3g5U0tWfahvh5EqZp9j3fxvKGcEYNA8CH3rFpYwltCxk_yKNkQFJvXcUOyLbu9t98HBvhcl2-vL-g61K7f9v_ZEvRuhJFbGNXRY4GZdvEuzsKacNcYOMPELptoEZpgeHvilfqPtIGhQJbl5f8m4etXfHlC29N7dAd3avkiqfE_4zpUGe9t8ZGonpZkzvBgsknK_g7pCwI8SstBKJJm6s9etbbmQJsHO1mwLdw",
];

const KEYLESS_TEST_TIMEOUT = 12000;

describe("keyless api", () => {
  const ephemeralKeyPair = EPHEMERAL_KEY_PAIR;
  const { aptos } = getAptosClient();
  const jwkAccount = Account.generate();

  beforeAll(async () => {
    await aptos.fundAccount({
      accountAddress: jwkAccount.accountAddress,
      amount: FUND_AMOUNT,
    });
    const jwkTransaction = await aptos.updateFederatedKeylessJwkSetTransaction({
      sender: jwkAccount,
      iss: "test.federated.oidc.provider",
      jwksUrl: "https://github.com/aptos-labs/aptos-core/raw/main/types/src/jwks/rsa/secure_test_jwk.json",
    });
    const committedJwkTxn = await aptos.signAndSubmitTransaction({ signer: jwkAccount, transaction: jwkTransaction });
    await aptos.waitForTransaction({ transactionHash: committedJwkTxn.hash });
  });

  test(
    "installs jwks for an auth0 iss",
    async () => {
      const sender = Account.generate();
      await aptos.fundAccount({
        accountAddress: sender.accountAddress,
        amount: FUND_AMOUNT,
      });
      const jwkTransaction = await aptos.updateFederatedKeylessJwkSetTransaction({
        sender,
        iss: "https://dev-qtdgjv22jh0v1k7g.us.auth0.com/",
      });
      const committedJwkTxn = await aptos.signAndSubmitTransaction({ signer: sender, transaction: jwkTransaction });
      await aptos.waitForTransaction({ transactionHash: committedJwkTxn.hash });
    },
    KEYLESS_TEST_TIMEOUT,
  );

  describe.each([
    { jwts: TEST_JWT_TOKENS, jwkAddress: undefined },
    { jwts: TEST_FEDERATED_JWT_TOKENS, jwkAddress: jwkAccount.accountAddress },
  ])("keyless account", ({ jwts, jwkAddress }) => {
    let i = 0;
    let jwt: string;
    beforeEach(async () => {
      jwt = jwts[i % jwts.length];
      i += 1;
    });

    test(
      "derives the keyless account and submits a transaction",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress });
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, sender, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "creates the keyless account via the static constructor and submits a transaction",
      async () => {
        const pepper = await aptos.getPepper({ jwt, ephemeralKeyPair });
        const publicKey =
          jwkAddress === undefined
            ? KeylessPublicKey.fromJwtAndPepper({ jwt, pepper })
            : FederatedKeylessPublicKey.fromJwtAndPepper({ jwt, pepper, jwkAddress });
        const address = await aptos.lookupOriginalAccountAddress({
          authenticationKey: publicKey.authKey().derivedAddress(),
        });
        const proof = await aptos.getProof({ jwt, ephemeralKeyPair, pepper });

        const account =
          jwkAddress === undefined
            ? KeylessAccount.create({ address, proof, jwt, ephemeralKeyPair, pepper })
            : FederatedKeylessAccount.create({ address, proof, jwt, ephemeralKeyPair, pepper, jwkAddress });
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, account, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "derives the keyless account with email uidKey and submits a transaction",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, uidKey: "email" })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress, uidKey: "email" });
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, sender, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "derives the keyless account with custom pepper and submits a transaction",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, pepper: new Uint8Array(31) })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress, pepper: new Uint8Array(31) });
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, sender, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "deriving keyless account with async proof fetch executes callback",
      async () => {
        let succeeded = false;
        const proofFetchCallback = async (res: ProofFetchStatus) => {
          if (res.status === "Failed") {
            return;
          }
          succeeded = true;
        };
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback, jwkAddress });
        expect(succeeded).toBeFalsy();
        await sender.waitForProofFetch();
        expect(succeeded).toBeTruthy();
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, sender, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "derives the keyless account with async proof fetch and submits a transaction",
      async () => {
        const proofFetchCallback = async () => {};
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback, jwkAddress });
        await aptos.fundAccount({
          accountAddress: sender.accountAddress,
          amount: FUND_AMOUNT,
        });
        const transaction = await aptos.transferCoinTransaction({
          sender: sender.accountAddress,
          recipient: sender.accountAddress,
          amount: TRANSFER_AMOUNT,
        });
        const pendingTxn = await aptos.signAndSubmitTransaction({ signer: sender, transaction });
        await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "deriving keyless account with async proof fetch throws when trying to immediately sign",
      async () => {
        const proofFetchCallback = async () => {};
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, proofFetchCallback, jwkAddress });
        await aptos.fundAccount({
          accountAddress: sender.accountAddress,
          amount: FUND_AMOUNT,
        });
        const transaction = await aptos.transferCoinTransaction({
          sender: sender.accountAddress,
          recipient: sender.accountAddress,
          amount: TRANSFER_AMOUNT,
        });
        expect(() => sender.signTransaction(transaction)).toThrow();
        await sender.waitForProofFetch();
        sender.signTransaction(transaction);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "deriving keyless account using all parameters",
      async () => {
        const proofFetchCallback = async () => {};

        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({
                jwt,
                ephemeralKeyPair,
                uidKey: "email",
                pepper: new Uint8Array(31),
                proofFetchCallback,
              })
            : await aptos.deriveKeylessAccount({
                jwt,
                ephemeralKeyPair,
                uidKey: "email",
                pepper: new Uint8Array(31),
                proofFetchCallback,
                jwkAddress,
              });
        const recipient = Account.generate();
        await simpleCoinTransactionHelper(aptos, sender, recipient);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "simulation works correctly",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress });
        await aptos.fundAccount({
          accountAddress: sender.accountAddress,
          amount: FUND_AMOUNT,
        });
        const transaction = await aptos.transferCoinTransaction({
          sender: sender.accountAddress,
          recipient: sender.accountAddress,
          amount: TRANSFER_AMOUNT,
        });
        await aptos.transaction.simulate.simple({ signerPublicKey: sender.publicKey, transaction });
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "keyless account verifies signature for arbitrary message correctly",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress });
        const message = "hello world";
        const signature = sender.sign(message);
        expect(sender.verifySignature({ message, signature })).toBe(true);
      },
      KEYLESS_TEST_TIMEOUT,
    );

    test(
      "serializes and deserializes",
      async () => {
        const sender =
          jwkAddress === undefined
            ? await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair })
            : await aptos.deriveKeylessAccount({ jwt, ephemeralKeyPair, jwkAddress });
        const bytes = sender.bcsToBytes();
        const deserializedAccount =
          jwkAddress === undefined ? KeylessAccount.fromBytes(bytes) : FederatedKeylessAccount.fromBytes(bytes);
        expect(bytes).toEqual(deserializedAccount.bcsToBytes());
      },
      KEYLESS_TEST_TIMEOUT,
    );
  });
});
