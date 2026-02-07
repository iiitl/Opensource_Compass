package orchestration

func ExtractLanguages(userCtx *UserContext) []string {
	var langs []string

	for _, p := range userCtx.Preferences {
		if p.PreferenceType == "language" {
			langs = append(langs, p.Value)
		}
	}

	return langs
}

func ExtractDomains(userCtx *UserContext) []string {
	var domains []string

	for _, p := range userCtx.Preferences {
		if p.PreferenceType == "domain" {
			domains = append(domains, p.Value)
		}
	}

	return domains
}
