import * as path from 'path'
import * as assert from 'assert'
import * as ttm from 'azure-pipelines-task-lib/mock-test'

describe('Gitleaks Execution', function () {
  it('Should succeed when gitleaks find no leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldSucceedWhenGitLeaksReturnsExitCodeZero.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when gitleaks find leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldFailWhenGitLeaksReturnsExitCodeOne.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'Leaks or error encountered. See log and report for details.'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should succeed with warning when gitleaks find leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldWarningWhenGitLeaksReturnsExitCodeOne.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.stdout.includes('SucceededWithIssues'), true, "Should contain 'SucceededWithIssues'")
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'Leaks or error encountered. See log and report for details.'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Upload gitleaks results', function () {
  it('Should upload results when file exists and upload is set to true', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldUploadFileResults')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.includes('##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;]'), true, "Should contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should upload Sarif results when file exists and upload is set to true', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldUploadFileResultsSarif')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.includes('##vso[artifact.upload containerfolder=CodeAnalysisLogs;artifactname=CodeAnalysisLogs;]'), true, "Should contain '##vso[artifact.upload containerfolder=CodeAnalysisLogs;artifactname=CodeAnalysisLogs;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should not upload results when upload is set to false', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldNotUploadFileResultsWhenUploadIsOff')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.indexOf('##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;]'), -1, "Should not contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should not upload results when report file does not exist', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldNotUploadFileResultsWhenUploadIsOff')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.indexOf('##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;]'), -1, "Should not contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Gitleaks parameter calls', function () {
  it('Should always provide the default parameters', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithDefaultParameters')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the --verbose parameter to gitleaks when verbose flag is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithVerboseParameter')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the --no-git parameter to gitleaks when nogit flag is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithNoGitParameter')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the --redact parameter to gitleaks when redact flag is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithRedactParameter')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the extra arguments to gitleaks when provided - One argument', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithOneArgument')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the extra arguments to gitleaks when provided - Two arguments', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithTwoArguments')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Provide Config files', function () {
  it('Should accept default config files', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptNoConfig')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should accept predefined config files', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptPredefinedConfig')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should succeed when existing custom config file is provided', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptCustomConfigFile')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when config file is not provided', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldFailWhenCustomConfigFileIsNotProvided')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should be invoked 0 time')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.includes('loc_mock_IncorrectConfig'), true, "Should contain 'Incorrect configuration set.'")
    done()
  })
})

describe('Gitleaks Releases', function () {
  it('Should download Darwin/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnDarwinX64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('gitleaks-darwin-amd64'), true, "Should contain 'gitleaks-darwin-amd64'")
    done()
  })
  it('Should download WindowsNT/x86', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnWindowsNTx86')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('gitleaks-windows-386.exe'), true, "Should contain 'gitleaks-windows-386.exe'")
    done()
  })
  it('Should download WindowsNT/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnWindowsNTx64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('gitleaks-windows-amd64.exe'), true, "Should contain 'gitleaks-windows-amd64.exe'")
    done()
  })
  it('Should download Linux/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnLinuxx64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('gitleaks-linux-amd64'), true, "Should contain 'gitleaks-linux-amd64'")
    done()
  })
  it('Should download Linux/Arm', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnLinuxArm')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('gitleaks-linux-arm'), true, "Should contain 'gitleaks-linux-arm'")
    done()
  })
})

describe('Gitleaks versions', function () {
  it('Should get latest when input version is set to latest', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldDownloadedWhenLatest')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_OnlineAgentHasNotTheLatestVersion'), true, "Should contain 'loc_mock_OnlineAgentHasNotTheLatestVersion.'")
    done()
  })
  it('Should get version that is specified.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldDownloadedWhenSpecified')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_NoToolcacheDownloading'), true, "Should contain 'loc_mock_NoToolcacheDownloading.'")
    done()
  })
})

describe('Gitleaks custom location', function () {
  it('Should fail when custom tool cannot be found', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldFailWhenCustomToolLocationCanNotBeFound.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, false, 'should have failed')
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should be invoked 0 times')
    assert.strictEqual(tr.stdout.includes('loc_mock_GitLeaksNotFound'), true, "customLocation/gitleaks-darwin-amd64'")
    done()
  })
  it('Should succeed with custom tool', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldSucceedWithCustomLocation.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Gitleaks toolcache', function () {
  it('Should download when gitleaks version is not in toolcache', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldDownloadWhenNotInToolCache')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_OnlineAgentHasNotTheLatestVersion'), true, "Should contain 'gitleaks is not available in toolcache'.")
    done()
  })
  it('Should not download when gitleaks version is in toolcache.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldNotDownloadWhenInToolCache')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_AvailableInToolcache'), true, "gitleaks is already available in toolcache'")
    done()
  })
})
