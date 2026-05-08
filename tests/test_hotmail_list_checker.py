import unittest

from hotmail_list_checker import SourceEntry, analyze_source_entries, classify_provider


class HotmailListCheckerTests(unittest.TestCase):
    def test_classify_provider_detects_microsoft_domains(self) -> None:
        self.assertEqual(classify_provider("hotmail.com"), ("hotmail", True))
        self.assertEqual(classify_provider("outlook.co.uk"), ("outlook", True))
        self.assertEqual(classify_provider("gmail.com"), ("non-microsoft", False))

    def test_analyze_source_entries_flags_duplicates_and_invalid_rows(self) -> None:
        entries = [
            SourceEntry(reference="sample.txt:1", text="Alice@Hotmail.com"),
            SourceEntry(reference="sample.txt:2", text="alice@hotmail.com"),
            SourceEntry(reference="sample.txt:3", text="not-an-email"),
        ]

        results, cleaned = analyze_source_entries(entries)

        self.assertEqual([result.status for result in results], ["valid", "duplicate", "invalid_or_missing_email"])
        self.assertEqual(cleaned, ["alice@hotmail.com"])

    def test_analyze_source_entries_only_microsoft_filter(self) -> None:
        entries = [
            SourceEntry(reference="sample.txt:1", text="first@hotmail.com"),
            SourceEntry(reference="sample.txt:2", text="second@gmail.com"),
        ]

        results, cleaned = analyze_source_entries(entries, only_microsoft=True)

        self.assertEqual([result.status for result in results], ["valid", "ignored_non_microsoft"])
        self.assertEqual(cleaned, ["first@hotmail.com"])

    def test_analyze_source_entries_blocks_credential_like_entries(self) -> None:
        entries = [
            SourceEntry(reference="sample.txt:1", text="user@hotmail.com:super-secret-password"),
        ]

        results, cleaned = analyze_source_entries(entries)

        self.assertEqual(results[0].status, "unsupported_credential_like_entry")
        self.assertEqual(cleaned, [])


if __name__ == "__main__":
    unittest.main()
